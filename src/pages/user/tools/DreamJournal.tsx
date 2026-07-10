import React, { useState, useEffect } from 'react';
import { Moon, ArrowLeft, Plus, Calendar, Save, Trash2, ChevronDown, CheckCircle2, RefreshCw, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../lib/firebase';
import { collection, query, where, onSnapshot, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

interface DreamEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  interpretation: string;
  type: 'rahmani' | 'nafsani' | 'shaytani' | 'unknown';
  wirdDone?: string;
}

export const DreamJournal: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'local'>('local');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [expandedDreamIds, setExpandedDreamIds] = useState<Set<string>>(new Set());
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [wirdDone, setWirdDone] = useState('');
  const [type, setType] = useState<DreamEntry['type']>('unknown');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [syncCount, setSyncCount] = useState(0);

  const toggleDream = (id: string) => {
    const newSet = new Set(expandedDreamIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedDreamIds(newSet);
  };

  const syncOfflineDreams = async () => {
    if (!user || !navigator.onLine) return;
    
    try {
      const pending = JSON.parse(localStorage.getItem('asrar_pending_dreams') || '[]');
      if (pending.length === 0) return;
      
      setSyncStatus('syncing');
      let successCount = 0;
      const remainingPending = [];

      for (const dream of pending) {
        try {
          const { isPendingSync, ...cleanDream } = dream;
          await setDoc(doc(db, 'dreams', dream.id), {
            ...cleanDream,
            userId: user.uid
          });
          successCount++;
        } catch (e) {
          console.error("Failed to sync offline dream:", e);
          remainingPending.push(dream);
        }
      }

      localStorage.setItem('asrar_pending_dreams', JSON.stringify(remainingPending));
      
      if (successCount > 0) {
        setSyncCount(successCount);
        setDreams(prev => prev.map(d => {
          const wasSynced = pending.some((p: any) => p.id === d.id) && !remainingPending.some((p: any) => p.id === d.id);
          if (wasSynced) {
            const { isPendingSync, ...rest } = d as any;
            return rest as DreamEntry;
          }
          return d;
        }));
        setTimeout(() => setSyncCount(0), 5000);
      }
      
      if (remainingPending.length === 0) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('local');
      }
    } catch (err) {
      console.error("Error during offline sync:", err);
    }
  };

  useEffect(() => {
    // 1. Load from local cache first
    const saved = localStorage.getItem('asrar_dreams');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setDreams(parsed);
      } catch (e) {}
    }

    if (!user) {
      setSyncStatus('local');
      return;
    }

    // 2. Subscribe to firestore dreams
    setSyncStatus('syncing');
    const q = query(collection(db, 'dreams'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fbDreams: DreamEntry[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fbDreams.push({
          id: docSnap.id,
          date: data.date || new Date().toISOString(),
          title: data.title || '',
          content: data.content || '',
          interpretation: data.interpretation || '',
          type: data.type || 'unknown',
          wirdDone: data.wirdDone || '',
          isPendingSync: data.isPendingSync || false
        } as any);
      });

      // Merge with local pending dreams so they don't disappear when Firestore snaps overwrite local cache
      const pending = JSON.parse(localStorage.getItem('asrar_pending_dreams') || '[]');
      const pendingIds = pending.map((p: any) => p.id);
      
      // Filter out any of the incoming firebase dreams that are already present in pending to avoid duplicates
      const cleanFbDreams = fbDreams.filter(fd => !pendingIds.includes(fd.id));
      const mergedDreams = [...pending, ...cleanFbDreams];

      mergedDreams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setDreams(mergedDreams);
      localStorage.setItem('asrar_dreams', JSON.stringify(mergedDreams));
      
      if (pending.length === 0) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('local');
      }
    }, (error) => {
      console.error("Error loading dreams from cloud:", error);
      setSyncStatus('local');
    });

    return () => unsubscribe();
  }, [user]);

  // Handle Online auto-sync
  useEffect(() => {
    window.addEventListener('online', syncOfflineDreams);
    if (navigator.onLine && user) {
      syncOfflineDreams();
    }
    return () => {
      window.removeEventListener('online', syncOfflineDreams);
    };
  }, [user]);

  const handleInterpret = async () => {
    if (!title || !content) {
      alert("Veuillez remplir le titre et le récit du rêve d'abord.");
      return;
    }
    setIsInterpreting(true);
    try {
      const res = await fetch('/api/dreams/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, type, wirdDone })
      });
      const data = await res.json();
      if (data.interpretation) {
        setInterpretation(data.interpretation);
      } else {
        alert(data.error || "Erreur d'interprétation");
      }
    } catch (e) {
      alert("Erreur réseau. Impossible d'interpréter le rêve sans connexion internet.");
    } finally {
      setIsInterpreting(false);
    }
  };

  const saveDream = async () => {
    if (!title || !content) return;

    setSyncStatus('syncing');
    const dreamId = Date.now().toString();
    const newDream: DreamEntry & { isPendingSync?: boolean } = {
      id: dreamId,
      date: new Date().toISOString(),
      title,
      content,
      interpretation,
      type,
      wirdDone
    };

    if (user) {
      if (navigator.onLine) {
        try {
          await setDoc(doc(db, 'dreams', dreamId), {
            ...newDream,
            userId: user.uid
          });
          
          const updated = [newDream as DreamEntry, ...dreams];
          setDreams(updated);
          localStorage.setItem('asrar_dreams', JSON.stringify(updated));
          setSyncStatus('synced');
        } catch (e) {
          console.error("Error saving dream to Cloud, saving to pending list:", e);
          newDream.isPendingSync = true;
          const pending = JSON.parse(localStorage.getItem('asrar_pending_dreams') || '[]');
          pending.push({ ...newDream, userId: user.uid });
          localStorage.setItem('asrar_pending_dreams', JSON.stringify(pending));
          
          const updated = [newDream as DreamEntry, ...dreams];
          setDreams(updated);
          localStorage.setItem('asrar_dreams', JSON.stringify(updated));
          setSyncStatus('local');
        }
      } else {
        // Explicitly offline
        newDream.isPendingSync = true;
        const pending = JSON.parse(localStorage.getItem('asrar_pending_dreams') || '[]');
        pending.push({ ...newDream, userId: user.uid });
        localStorage.setItem('asrar_pending_dreams', JSON.stringify(pending));
        
        const updated = [newDream as DreamEntry, ...dreams];
        setDreams(updated);
        localStorage.setItem('asrar_dreams', JSON.stringify(updated));
        setSyncStatus('local');
      }
    } else {
      const updated = [newDream as DreamEntry, ...dreams];
      setDreams(updated);
      localStorage.setItem('asrar_dreams', JSON.stringify(updated));
      setSyncStatus('local');
    }
    
    // Gamification
    let stats; try { stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}'); if (!stats || typeof stats !== 'object') stats = {}; } catch(e) { stats = {}; }
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));

    setIsEditorOpen(false);
    setTitle('');
    setContent('');
    setInterpretation('');
    setWirdDone('');
    setType('unknown');
  };

  const deleteDream = async (id: string) => {
    setSyncStatus('syncing');
    
    // Remove from pending local list
    const pending = JSON.parse(localStorage.getItem('asrar_pending_dreams') || '[]');
    const filteredPending = pending.filter((p: any) => p.id !== id);
    localStorage.setItem('asrar_pending_dreams', JSON.stringify(filteredPending));

    if (user) {
      try {
        await deleteDoc(doc(db, 'dreams', id));
        
        const updated = dreams.filter(d => d.id !== id);
        setDreams(updated);
        localStorage.setItem('asrar_dreams', JSON.stringify(updated));
        
        if (filteredPending.length === 0) {
          setSyncStatus('synced');
        } else {
          setSyncStatus('local');
        }
      } catch (e) {
        console.error("Error deleting dream from Cloud:", e);
        
        const updated = dreams.filter(d => d.id !== id);
        setDreams(updated);
        localStorage.setItem('asrar_dreams', JSON.stringify(updated));
        setSyncStatus('local');
      }
    } else {
      const updated = dreams.filter(d => d.id !== id);
      setDreams(updated);
      localStorage.setItem('asrar_dreams', JSON.stringify(updated));
      setSyncStatus('local');
    }
  };

  const typeConfig = {
    rahmani: { label: 'Rahmani (Véridique)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' },
    nafsani: { label: 'Nafsani (Psychologique)', bg: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' },
    shaytani: { label: 'Shaytani (Cauchemar)', bg: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' },
    unknown: { label: 'Non défini', bg: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700' }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Moon className="text-indigo-500" />
              Journal des Rêves
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("tools.dreams.description")}</p>
              
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
                  <Cloud size={12} />
                  {user ? t('sync.cached', 'Cache local') : t('sync.localOnly', 'Cache local uniquement (Connexion requise)')}
                </span>
              )}
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsEditorOpen(true)}
          className="w-12 h-12 bg-indigo-600 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isEditorOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Nouveau Rêve</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Titre / Résumé court</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Voler au-dessus de la Mecque"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nature du Rêve</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="unknown">Non défini</option>
                  <option value="rahmani">Rêve Véridique (Ru'ya Rahamaniya)</option>
                  <option value="nafsani">Rêve de l'Ame (Hulm Nafsani)</option>
                  <option value="shaytani">Cauchemar (Hulm Shaytani) - À ne pas raconter!</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Zikr/Wird prélude (Avant de dormir)</label>
                <input
                  type="text"
                  value={wirdDone}
                  onChange={(e) => setWirdDone(e.target.value)}
                  placeholder="Ex: Ya Latif 129 fois, Ya Nur..."
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Récit détaillé</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Le prophète (paix sur lui) a dit : 'Le rêve est l'une des quarante-six parties de la prophétie'..."
                  className="w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 resize-none"
                ></textarea>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">{t("common.interpretation")} (Optionnel)</label>
                  <button
                    onClick={handleInterpret}
                    disabled={isInterpreting || !title || !content}
                    className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
                  >
                    {isInterpreting ? "Analyse IA en cours..." : "Interpréter avec l'IA (Ibn Sirin)"}
                  </button>
                </div>
                <textarea
                  value={interpretation}
                  onChange={(e) => setInterpretation(e.target.value)}
                  placeholder="Notes personnelles d'interprétation selon Ibn Sirin ou votre intuition..."
                  className="w-full h-24 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button 
                  onClick={saveDream}
                  disabled={!title || !content}
                  className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white disabled:opacity-50 flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                >
                  <Save size={18} /> {t("common.save")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {syncCount > 0 && (
          <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="text-emerald-500" size={20} />
            <p className="text-sm font-bold">
              Synchronisation réussie : {syncCount} rêve(s) enregistré(s) en mode hors-ligne ont été synchronisés automatiquement avec le serveur !
            </p>
          </div>
        )}

        {dreams.length === 0 && !isEditorOpen && (
          <div className="text-center py-12">
            <Moon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun rêve documenté.</p>
          </div>
        )}

        {dreams.map(dream => {
          const isExpanded = expandedDreamIds.has(dream.id);
          const isPending = (dream as any).isPendingSync;
          return (
            <motion.div 
              key={dream.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => toggleDream(dream.id)}
            >
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDream(dream.id);
                  }}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${typeConfig[dream.type].bg}`}>
                  {typeConfig[dream.type].label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 font-medium">
                  <Calendar size={14} />
                  {new Date(dream.date).toLocaleDateString('fr-FR')}
                </span>
                {isPending && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-100/30 dark:border-amber-800/30">
                    <Cloud size={12} className="text-amber-500 animate-pulse" />
                    Saisie différée (En attente de connexion)
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 pr-16">{dream.title}</h3>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
                      {dream.wirdDone && (
                        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium border border-indigo-100/50 dark:border-indigo-800/30">
                          <span className="opacity-70 text-xs uppercase tracking-wider font-bold">Prélude (Wird):</span>
                          {dream.wirdDone}
                        </div>
                      )}

                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-serif mb-4">
                        {dream.content}
                      </p>
                      {dream.interpretation && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/10 border-l-4 border-indigo-400 p-4 rounded-r-xl">
                           <h4 className="text-xs uppercase tracking-widest font-bold text-indigo-500 mb-2">{t("common.interpretation")} (Ta'bir)</h4>
                           <p className="text-sm text-indigo-900 dark:text-indigo-200">{dream.interpretation}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
