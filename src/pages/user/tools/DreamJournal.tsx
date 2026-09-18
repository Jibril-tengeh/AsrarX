import React, { useState, useEffect } from 'react';
import { Moon, ArrowLeft, Plus, Calendar, Save, Trash2, ChevronDown, CheckCircle2, RefreshCw, Cloud, Download, BookOpen, Sparkles, Copy, Check, Edit3, Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { db } from '../../../lib/firebase';
import { collection, query, where, onSnapshot, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { getApiUrl } from '../../../lib/api';
import { jsPDF } from 'jspdf';
import { exportDreamToHighDefPDF, exportAllDreamsToHighDefPDF } from '../../../utils/dreamPdfExporter';

export const SCHOLARS = [
  { id: 'all', name: 'Tous les Savants', arabic: 'الكل', emoji: '🌟', desc: 'Synthèse globale des 4 maîtres' },
  { id: 'ibn_sirin', name: 'Ibn Sīrīn', arabic: 'ابن سيرين', emoji: '📜', desc: 'Analogies Coran & Sunnah' },
  { id: 'nabulusi', name: 'Al-Nābulusī', arabic: 'النابلسي', emoji: '🕊️', desc: 'Dictionnaire des symboles' },
  { id: 'ibn_shahin', name: 'Ibn Shāhīn', arabic: 'ابن شاهين', emoji: '⚔️', desc: 'Selon le rang & la piété' },
  { id: 'jafar_sadiq', name: 'Imam Ja\'far Al-Ṣādiq', arabic: 'الإمام الصادق', emoji: '💎', desc: 'Facettes & aspects multiples' },
] as const;

export function normalizeInterpretationMarkdown(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  let text = raw.trim();

  // If text uses # or ## headers, convert to ###
  text = text.replace(/^#{1,2}\s+/gm, '### ');

  // If text uses 1. ... or **1. ...**, convert them to ### 1. [Emoji] [Title]
  text = text.replace(/^(?:\*\*)?([1-9])[\.\)]\s*(?:\*\*)?\s*(.+?)(?:\*\*)?:?\s*$/gm, (match, num, title) => {
    if (match.startsWith('###')) return match;
    const cleanTitle = title.replace(/\*\*/g, '').trim();
    let emoji = '✨';
    if (/classification|nature|sunnah|ru'ya|vision/i.test(cleanTitle)) emoji = '🌙';
    else if (/symbole|sirin|analog/i.test(cleanTitle)) emoji = '📜';
    else if (/nabulusi|matiere|spirituel|sens/i.test(cleanTitle)) emoji = '🕊️';
    else if (/shahin|situation|epreuve|piege|combat/i.test(cleanTitle)) emoji = '⚔️';
    else if (/jafar|sadiq|facette|aspect|dimension/i.test(cleanTitle)) emoji = '🌟';
    else if (/recommandation|conseil|invocation|doua|zikr|priere/i.test(cleanTitle)) emoji = '🤲';
    else if (/signification|diagnostic|avertissement/i.test(cleanTitle)) emoji = '🧭';

    const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(cleanTitle);
    return `\n\n### ${num}. ${hasEmoji ? '' : emoji + ' '}${cleanTitle}\n`;
  });

  // Ensure double newlines before headers
  text = text.replace(/([^\n])\n(###\s+)/g, '$1\n\n$2');
  return text.trim();
}

export const StructuredInterpretationMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const normalized = normalizeInterpretationMarkdown(content);

  const renderHeading = (children: React.ReactNode) => (
    <div className="mt-5 mb-2.5 pt-1 first:mt-0">
      <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-indigo-950 dark:text-indigo-200 bg-gradient-to-r from-indigo-100/90 via-purple-50/70 to-transparent dark:from-indigo-950/80 dark:via-purple-950/50 dark:to-transparent px-3.5 py-2.5 rounded-xl border-l-4 border-indigo-600 dark:border-indigo-400 shadow-xs flex items-center gap-2 tracking-wide font-sans">
        {children}
      </h3>
    </div>
  );

  return (
    <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans space-y-2.5">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => renderHeading(children),
          h2: ({ children }) => renderHeading(children),
          h3: ({ children }) => renderHeading(children),
          h4: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-bold text-purple-900 dark:text-purple-300 mt-3 mb-1 px-1 flex items-center gap-1.5 font-sans">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed my-2 font-normal">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-indigo-950 dark:text-indigo-200 bg-indigo-50/80 dark:bg-indigo-900/40 px-1 py-0.5 rounded">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2.5 pl-1 sm:pl-2 list-none">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-2.5 pl-4 list-decimal text-xs sm:text-sm text-gray-700 dark:text-gray-200">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 flex items-start gap-2 leading-relaxed">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-2 shrink-0" />
              <div className="flex-1">{children}</div>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2.5 p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border-l-4 border-amber-500 text-amber-950 dark:text-amber-200 text-xs sm:text-sm italic shadow-xs">
              {children}
            </blockquote>
          ),
        }}
      >
        {normalized}
      </Markdown>
    </div>
  );
};

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
  const { t, language } = useLanguage();
  const { user, isPremium } = useAuth();
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

  const [selectedScholar, setSelectedScholar] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [copied, setCopied] = useState(false);
  const [pastDreamInterpretingId, setPastDreamInterpretingId] = useState<string | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportingDreamId, setExportingDreamId] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // High-definition PDF Export helper for single dream
  const exportSingleToPDF = async (dream: DreamEntry) => {
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }
    setExportingDreamId(dream.id);
    setIsExportingPDF(true);
    try {
      await exportDreamToHighDefPDF(dream);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Erreur lors de la génération du PDF");
    } finally {
      setIsExportingPDF(false);
      setExportingDreamId(null);
    }
  };

  // High-definition PDF Export helper for all dreams
  const exportAllToPDF = async () => {
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }
    if (dreams.length === 0) {
      alert("Aucun rêve à exporter.");
      return;
    }

    setIsExportingPDF(true);
    try {
      await exportAllDreamsToHighDefPDF(dreams);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Erreur lors de la génération du recueil PDF");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const toggleDream = (id: string) => {
    const newSet = new Set(expandedDreamIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedDreamIds(newSet);
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
          wirdDone: data.wirdDone || ''
        });
      });

      fbDreams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setDreams(fbDreams);
      localStorage.setItem('asrar_dreams', JSON.stringify(fbDreams));
      setSyncStatus('synced');
    }, (error) => {
      console.error("Error loading dreams from cloud:", error);
      setSyncStatus('local');
    });

    return () => unsubscribe();
  }, [user]);

  const handleInterpret = async (scholarParam?: string) => {
    if (!content.trim()) {
      alert("Veuillez d'abord rédiger le récit de votre rêve.");
      return;
    }
    const finalScholar = scholarParam || selectedScholar;
    const finalTitle = title.trim() || content.trim().slice(0, 35) + '...';
    if (!title.trim()) {
      setTitle(finalTitle);
    }
    setIsInterpreting(true);
    try {
      const res = await fetch(getApiUrl('/api/dreams/interpret'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: finalTitle, 
          content, 
          type, 
          wirdDone, 
          language,
          scholar: finalScholar 
        })
      });
      const data = await res.json();
      if (data.interpretation) {
        setInterpretation(data.interpretation);
        setViewMode('rendered');
      } else {
        alert(data.error || "Erreur d'interprétation");
      }
    } catch (e) {
      alert("Erreur réseau lors de la communication avec le service d'interprétation.");
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleInterpretPastDream = async (dream: DreamEntry, scholarParam: string = 'all') => {
    setPastDreamInterpretingId(dream.id);
    try {
      const res = await fetch(getApiUrl('/api/dreams/interpret'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: dream.title || dream.content.slice(0, 35),
          content: dream.content,
          type: dream.type,
          wirdDone: dream.wirdDone,
          language,
          scholar: scholarParam
        })
      });
      const data = await res.json();
      if (data.interpretation) {
        const updated = dreams.map(d => d.id === dream.id ? { ...d, interpretation: data.interpretation } : d);
        setDreams(updated);
        localStorage.setItem('asrar_dreams', JSON.stringify(updated));

        if (user) {
          try {
            await setDoc(doc(db, 'dreams', dream.id), {
              ...dream,
              interpretation: data.interpretation,
              userId: user.uid
            });
          } catch (cloudErr) {
            console.warn("Could not sync interpreted past dream to cloud:", cloudErr);
          }
        }
        setExpandedDreamIds(prev => new Set([...prev, dream.id]));
      } else if (data.error) {
        alert(data.error);
      }
    } catch (e) {
      console.error("Error interpreting past dream:", e);
      alert("Erreur lors de l'interprétation du rêve passé.");
    } finally {
      setPastDreamInterpretingId(null);
    }
  };

  const saveDream = async () => {
    if (!title || !content) return;

    setSyncStatus('syncing');
    const dreamId = Date.now().toString();
    const newDream: DreamEntry = {
      id: dreamId,
      date: new Date().toISOString(),
      title,
      content,
      interpretation,
      type,
      wirdDone
    };

    if (user) {
      try {
        await setDoc(doc(db, 'dreams', dreamId), {
          ...newDream,
          userId: user.uid
        });
        setSyncStatus('synced');
      } catch (e) {
        console.error("Error saving dream to Cloud:", e);
        setSyncStatus('local');
      }
    } else {
      const updated = [newDream, ...dreams];
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
    if (user) {
      try {
        await deleteDoc(doc(db, 'dreams', id));
        setSyncStatus('synced');
      } catch (e) {
        console.error("Error deleting dream from Cloud:", e);
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
              <p className="text-sm text-gray-500 dark:text-gray-300">{t("tools.dreams.description")}</p>
              
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
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                  <Cloud size={12} />
                  {user ? t('sync.cached', 'Cache local') : t('sync.localOnly', 'Cache local uniquement (Connexion requise)')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {dreams.length > 0 && (
            <button 
              onClick={exportAllToPDF}
              disabled={isExportingPDF}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-750 rounded-xl text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm font-semibold text-sm active:scale-95 disabled:opacity-60"
              title="Exporter tout en PDF haute fidélité"
            >
              {isExportingPDF && !exportingDreamId ? (
                <Loader2 size={18} className="text-indigo-500 animate-spin" />
              ) : (
                <Download size={18} className="text-indigo-500" />
              )}
              <span className="hidden sm:inline">
                {isExportingPDF && !exportingDreamId ? 'Exportation...' : 'Exporter PDF'}
              </span>
            </button>
          )}
          <button 
            onClick={() => setIsEditorOpen(true)}
            className="w-12 h-12 bg-indigo-600 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>
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

              <div className="space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                      {t("common.interpretation")} (Ta'bīr - Ibn Sīrīn & Savants)
                    </label>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Choisissez un savant ou lancez l'analyse globale structurée :
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInterpret()}
                    disabled={isInterpreting || !content.trim()}
                    className="text-xs font-bold px-3.5 py-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  >
                    {isInterpreting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Analyse en cours...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Interpréter avec l'IA ({SCHOLARS.find(s => s.id === selectedScholar)?.name})</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Interactive Scholar Selector Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {SCHOLARS.map((s) => {
                    const isSelected = selectedScholar === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedScholar(s.id);
                          if (content.trim()) {
                            handleInterpret(s.id);
                          }
                        }}
                        disabled={isInterpreting}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-300 dark:ring-indigo-700'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60'
                        }`}
                        title={s.desc}
                      >
                        <span>{s.emoji}</span>
                        <span>{s.name}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-gray-400 dark:text-gray-300'}`}>({s.arabic})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Interpretation preview container */}
                {interpretation ? (
                  <div className="bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-amber-50/20 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-amber-950/10 border border-indigo-200/70 dark:border-indigo-800/40 rounded-2xl p-4 shadow-sm relative">
                    <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-800/40 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                          Interprétation des Savants
                        </span>
                        <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                          {SCHOLARS.find(s => s.id === selectedScholar)?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(interpretation)}
                          className="px-2 py-1 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 flex items-center gap-1 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer"
                          title="Copier le texte"
                        >
                          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          <span className="hidden sm:inline">{copied ? "Copié !" : "Copier"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode(viewMode === 'rendered' ? 'raw' : 'rendered')}
                          className="px-2 py-1 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-gray-800 flex items-center gap-1 border border-indigo-200/50 dark:border-indigo-700/50 transition-all cursor-pointer"
                        >
                          {viewMode === 'rendered' ? (
                            <>
                              <Edit3 size={14} />
                              <span className="hidden sm:inline">Modifier</span>
                            </>
                          ) : (
                            <>
                              <Eye size={14} />
                              <span className="hidden sm:inline">Aperçu structuré</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {viewMode === 'rendered' ? (
                      <StructuredInterpretationMarkdown content={interpretation} />
                    ) : (
                      <textarea
                        value={interpretation}
                        onChange={(e) => setInterpretation(e.target.value)}
                        placeholder="L'interprétation apparaîtra ici..."
                        className="w-full h-64 bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono text-xs leading-relaxed"
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50/70 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-5 text-center">
                    <Sparkles size={22} className="mx-auto text-indigo-400 mb-2 opacity-70" />
                    <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                      Cliquez sur <strong>« Interpréter avec l'IA »</strong> ou sélectionnez un savant (Ibn Sīrīn, Al-Nābulusī, Ibn Shāhīn, Imam Ja'far Al-Ṣādiq) pour générer l'analyse structurée avec titres H3 et émojis.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
        {dreams.length === 0 && !isEditorOpen && (
          <div className="text-center py-12">
            <Moon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-300 font-medium">Aucun rêve documenté.</p>
          </div>
        )}

        {dreams.map((dream, dIdx) => {
          const isExpanded = expandedDreamIds.has(dream.id);
          return (
            <motion.div 
              key={dream.id ? `dream-${dream.id}-${dIdx}` : `dream-${dIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => toggleDream(dream.id)}
            >
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    exportSingleToPDF(dream);
                  }}
                  disabled={isExportingPDF}
                  className="text-gray-400 hover:text-indigo-500 transition-colors p-1 rounded-lg disabled:opacity-50"
                  title="Exporter ce rêve en PDF haute fidélité"
                >
                  {isExportingPDF && exportingDreamId === dream.id ? (
                    <Loader2 size={18} className="text-indigo-500 animate-spin" />
                  ) : (
                    <Download size={18} />
                  )}
                </button>
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
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${typeConfig[dream.type].bg}`}>
                  {typeConfig[dream.type].label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1 font-medium">
                  <Calendar size={14} />
                  {new Date(dream.date).toLocaleDateString('fr-FR')}
                </span>
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
                      {dream.interpretation ? (
                        <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-amber-50/30 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-amber-950/10 border-l-4 border-indigo-500 p-4 sm:p-5 rounded-r-2xl border border-indigo-100/50 dark:border-indigo-900/30 shadow-sm mt-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-indigo-100 dark:border-indigo-900/40">
                            <h4 className="text-xs uppercase tracking-widest font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                              <BookOpen size={14} className="text-indigo-600 dark:text-indigo-400" />
                              Interprétation Traditionnelle (Ta'bīr al-Ru'yā)
                            </h4>
                            <div className="flex flex-wrap items-center gap-1">
                              {SCHOLARS.map((s) => (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInterpretPastDream(dream, s.id);
                                  }}
                                  disabled={pastDreamInterpretingId === dream.id}
                                  className="text-[10px] bg-white/90 dark:bg-gray-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/70 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full font-semibold border border-gray-200 dark:border-gray-700 transition-all flex items-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
                                  title={`Consulter / Ré-interpréter selon ${s.name}`}
                                >
                                  {pastDreamInterpretingId === dream.id ? (
                                    <Loader2 size={10} className="animate-spin text-indigo-500" />
                                  ) : (
                                    <span>{s.emoji}</span>
                                  )}
                                  <span>{s.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <StructuredInterpretationMarkdown content={dream.interpretation} />
                        </div>
                      ) : (
                        <div className="mt-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-dashed border-indigo-200 dark:border-indigo-800/40 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xs text-indigo-950 dark:text-indigo-200">
                            <span className="font-bold flex items-center gap-1 mb-0.5">
                              <Moon size={14} className="text-indigo-500" />
                              Interprétation des savants disponible
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">Lancez l'analyse de ce rêve selon Ibn Sīrīn, Al-Nābulusī, Ibn Shāhīn ou l'Imam Ja'far :</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {SCHOLARS.map((s) => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInterpretPastDream(dream, s.id);
                                }}
                                disabled={pastDreamInterpretingId === dream.id}
                                className="text-xs font-bold px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-xs flex items-center gap-1 disabled:opacity-50 cursor-pointer active:scale-95"
                              >
                                {pastDreamInterpretingId === dream.id ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <span>{s.emoji}</span>
                                )}
                                <span>{s.name}</span>
                              </button>
                            ))}
                          </div>
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
