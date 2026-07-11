import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, increment, setDoc, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Users, Plus, Target, Sparkles, Flame, Check, ArrowLeft, RefreshCw, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface CollectiveDhikr {
  id: string;
  title: string;
  arabic?: string;
  currentCount: number;
  targetCount: number;
  createdBy: string;
  creatorName: string;
  createdAt: any;
}

export const CollectiveTasbih: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<CollectiveDhikr[]>([]);
  const [activeSession, setActiveSession] = useState<CollectiveDhikr | null>(null);
  const [loading, setLoading] = useState(true);
  const [myContribution, setMyContribution] = useState(0);

  // Sound and Vibration state
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Custom Creation Form
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArabic, setNewArabic] = useState('');
  const [newTarget, setNewTarget] = useState(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load sound & vibe settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('tasbih_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed && typeof parsed === 'object') {
          setSoundEnabled(!!parsed.sound);
          setVibrationEnabled(parsed.vibe !== false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Listen to active sessions in real-time
  useEffect(() => {
    const q = query(collection(db, 'collective_dhikr'), orderBy('currentCount', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: CollectiveDhikr[] = [];
      snapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() } as CollectiveDhikr);
      });
      
      // Seed default sessions if collection is empty
      if (fetched.length === 0 && !isSubmitting) {
        seedDefaultSessions();
      } else {
        setSessions(fetched);
        setLoading(false);
      }
    }, (error) => {
      console.error("Error listening to collective dhikr:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isSubmitting]);

  // Keep active session in sync with the real-time doc
  useEffect(() => {
    if (!activeSession) return;
    const found = sessions.find(s => s.id === activeSession.id);
    if (found) {
      setActiveSession(found);
    }
  }, [sessions, activeSession?.id]);

  const seedDefaultSessions = async () => {
    try {
      const defaults = [
        {
          title: "Grand Salawat Collectif",
          arabic: "ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَآلِ مُحَمَّدٍ",
          currentCount: 124,
          targetCount: 10000,
          createdBy: "system",
          creatorName: "AsrarHub",
          createdAt: new Date()
        },
        {
          title: "Istighfar Communautaire",
          arabic: "أَسْتَغْفِرُ ٱللَّٰهَ ٱلْعَظِيمَ وَأَتُوبُ إِلَيْهِ",
          currentCount: 89,
          targetCount: 50000,
          createdBy: "system",
          creatorName: "AsrarHub",
          createdAt: new Date()
        },
        {
          title: "Tahlil Collectif (La ilaha illallah)",
          arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
          currentCount: 231,
          targetCount: 100000,
          createdBy: "system",
          creatorName: "AsrarHub",
          createdAt: new Date()
        }
      ];

      for (const d of defaults) {
        const docId = d.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await setDoc(doc(db, 'collective_dhikr', docId), d);
      }
    } catch (e) {
      console.error("Error seeding collective dhikr:", e);
    }
  };

  const triggerVibration = async (type: 'tap' | 'success') => {
    if (!vibrationEnabled) return;
    try {
      if (type === 'tap') {
        await Haptics.impact({ style: ImpactStyle.Light });
      } else if (type === 'success') {
        await Haptics.notification({ type: 'SUCCESS' as any });
      }
    } catch (e) {
      if (navigator.vibrate) {
        if (type === 'tap') navigator.vibrate(40);
        if (type === 'success') navigator.vibrate([100, 50, 100, 50, 100]);
      }
    }
  };

  const playClick = () => {
    if (soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
      audio.volume = 0.1;
      audio.play().catch(() => {});
    }
  };

  const handleTap = async () => {
    if (!activeSession) return;
    
    // Play haptics and sounds locally first for latency-free experience
    triggerVibration('tap');
    playClick();
    setMyContribution(prev => prev + 1);

    try {
      const docRef = doc(db, 'collective_dhikr', activeSession.id);
      await updateDoc(docRef, {
        currentCount: increment(1)
      });

      // If target reached just now
      if (activeSession.currentCount + 1 === activeSession.targetCount) {
        triggerVibration('success');
      }
    } catch (e) {
      console.error("Error incrementing collective count:", e);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newTarget <= 0 || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const newSession = {
        title: newTitle.trim(),
        arabic: newArabic.trim() || null,
        currentCount: 0,
        targetCount: Number(newTarget),
        createdBy: user?.uid || 'guest',
        creatorName: user?.name || 'Anonyme',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'collective_dhikr'), newSession);
      
      setNewTitle('');
      setNewArabic('');
      setNewTarget(1000);
      setIsCreating(false);
    } catch (e) {
      console.error("Error creating collective session:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activePercent = activeSession 
    ? Math.min(100, Math.round((activeSession.currentCount / activeSession.targetCount) * 100)) 
    : 0;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!activeSession ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {/* Header & Button */}
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 text-sm sm:text-base">
                  <Users className="text-emerald-500" size={18} />
                  Tasbih Collectif
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Participez en temps réel aux objectifs de la communauté</p>
              </div>
              <button
                onClick={() => setIsCreating(!isCreating)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-2.5 transition-colors flex items-center justify-center gap-1 text-xs font-bold shadow-sm"
              >
                <Plus size={16} /> Créer
              </button>
            </div>

            {/* Custom Creation Drawer/Box */}
            {isCreating && (
              <motion.form
                onSubmit={handleCreateSession}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 space-y-3 shadow-md overflow-hidden"
              >
                <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">Lancer un Zikr Collectif</h4>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Nom du Zikr (Français) :</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Salawat de protection"
                    required
                    className="w-full p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Texte en Arabe (Optionnel) :</label>
                  <input
                    type="text"
                    value={newArabic}
                    onChange={(e) => setNewArabic(e.target.value)}
                    placeholder="Ex: اللهم صل على محمد"
                    className="w-full p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right font-arabic text-base"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">Objectif de Répétitions :</label>
                  <input
                    type="number"
                    value={newTarget}
                    onChange={(e) => setNewTarget(Math.max(10, parseInt(e.target.value) || 0))}
                    min="10"
                    step="500"
                    className="w-full p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl py-2 text-xs font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newTitle.trim()}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1"
                  >
                    {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : "Lancer l'Objectif"}
                  </button>
                </div>
              </motion.form>
            )}

            {/* List of Active Collective Sessions */}
            {loading ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <RefreshCw size={24} className="animate-spin text-emerald-500" />
                <p className="text-xs text-gray-500 mt-2">Chargement des sessions collectives...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 text-center flex flex-col items-center justify-center p-6">
                <AlertCircle className="text-gray-400 mb-2" size={32} />
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Aucune session active</p>
                <p className="text-xs text-gray-500 mt-1">Lisez des Wirds ou créez le tout premier objectif collectif ci-dessus !</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((sess) => {
                  const percent = Math.min(100, Math.round((sess.currentCount / sess.targetCount) * 100));
                  return (
                    <motion.div
                      key={sess.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveSession(sess);
                        setMyContribution(0);
                      }}
                      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-750 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Objectif Collectif
                          </span>
                          <h4 className="font-bold text-gray-900 dark:text-white text-base mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {sess.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          <Users size={14} className="text-emerald-500" />
                          <span>{sess.creatorName}</span>
                        </div>
                      </div>

                      {sess.arabic && (
                        <p className="text-right font-arabic text-lg text-emerald-800 dark:text-emerald-300 my-2 leading-relaxed">
                          {sess.arabic}
                        </p>
                      )}

                      {/* Progress bar */}
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md">{percent}% complété</span>
                          <span className="font-mono">{sess.currentCount.toLocaleString()} / {sess.targetCount.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          /* Active Counter View */
          <motion.div
            key="counter"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="flex flex-col items-center justify-center pb-8"
          >
            {/* Back to list */}
            <button
              onClick={() => setActiveSession(null)}
              className="self-start flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Voir tous les objectifs collectifs
            </button>

            {/* Active session info */}
            <div className="text-center w-full mb-6">
              <span className="bg-red-500 text-white text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-full animate-pulse shadow-sm shadow-red-500/20">
                🔴 Synchronisé en Temps Réel
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-3 leading-tight">
                {activeSession.title}
              </h2>
              {activeSession.arabic && (
                <p className="font-arabic text-2xl text-emerald-800 dark:text-emerald-300 mt-3 mb-1 max-w-sm mx-auto leading-relaxed">
                  {activeSession.arabic}
                </p>
              )}
            </div>

            {/* Main Pulse Button */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-6">
              {/* Outer Glows */}
              <motion.div 
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-2xl"
              />
              <motion.div 
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
                className="absolute inset-4 bg-teal-500/5 dark:bg-teal-500/3 rounded-full blur-3xl"
              />

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleTap}
                className="w-52 h-52 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex flex-col items-center justify-center shadow-2xl relative overflow-hidden active:scale-95 transition-all border-4 border-white dark:border-gray-800 group focus:outline-none"
              >
                {/* Visual ripple */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
                
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/50 mb-1">Contribution</span>
                <span className="text-5xl font-black font-mono tracking-tight drop-shadow">
                  {myContribution}
                </span>
                <span className="text-xs font-semibold text-emerald-100 mt-2">Cliquez pour répéter</span>
              </motion.button>
            </div>

            {/* Realtime Community Score */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 rounded-3xl p-5 w-full shadow-sm max-w-md mt-4 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-750 pb-3">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Target size={14} className="text-emerald-500" /> Objectif Collectif
                </span>
                <span className="text-sm font-black text-gray-900 dark:text-white font-mono">
                  {activeSession.targetCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Users size={14} className="text-emerald-500" /> Score Communautaire
                </span>
                <motion.span 
                  key={activeSession.currentCount}
                  initial={{ scale: 1.2, color: '#10b981' }}
                  animate={{ scale: 1, color: undefined }}
                  className="text-lg font-black text-gray-900 dark:text-white font-mono"
                >
                  {activeSession.currentCount.toLocaleString()}
                </motion.span>
              </div>

              {/* Real-time slider */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-gray-400 font-semibold">
                  <span>{activePercent}% réalisé</span>
                  <span>{Math.max(0, activeSession.targetCount - activeSession.currentCount).toLocaleString()} restants</span>
                </div>
                <div className="w-full h-2.5 bg-gray-50 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    animate={{ width: `${activePercent}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
                </div>
              </div>

              {activePercent >= 100 && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-2xl p-3 flex items-center gap-2.5 border border-emerald-100 dark:border-emerald-900/30">
                  <Sparkles size={18} className="text-amber-500 animate-spin" />
                  <p className="text-xs font-bold leading-normal">
                    Félicitations ! L'objectif collectif a été atteint avec succès par la communauté ! Continuez vos invocations pour récolter davantage de grâces.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
