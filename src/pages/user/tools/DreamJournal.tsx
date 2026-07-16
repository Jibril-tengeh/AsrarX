import React, { useState, useEffect } from 'react';
import { Moon, ArrowLeft, Plus, Calendar, Save, Trash2, ChevronDown, CheckCircle2, RefreshCw, Cloud, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../lib/firebase';
import { collection, query, where, onSnapshot, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { getApiUrl } from '../../../lib/api';
import { jsPDF } from 'jspdf';

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

  // PDF Export helper for single dream
  const exportSingleToPDF = (dream: DreamEntry) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Header Banner (Indigo-600)
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, pageWidth, 40, 'F');

      // Title inside banner
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Asrar - Journal des Reves', margin, 25);

      let y = 55;

      // Title of the dream
      doc.setTextColor(31, 41, 55);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      const titleLines = doc.splitTextToSize(dream.title, contentWidth);
      doc.text(titleLines, margin, y);
      y += (titleLines.length * 8) + 5;

      // Date and type
      doc.setTextColor(107, 114, 128);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const formattedDate = new Date(dream.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      const typeLabel = dream.type === 'rahmani' ? 'Rahmani (Veridique)' :
                        dream.type === 'nafsani' ? 'Nafsani (Psychologique)' :
                        dream.type === 'shaytani' ? 'Shaytani (Cauchemar)' : 'Non defini';
      doc.text(`Date : ${formattedDate}   |   Type : ${typeLabel}`, margin, y);
      y += 10;

      // Divider
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Prelude Wird
      if (dream.wirdDone) {
        doc.setFillColor(243, 244, 246);
        doc.rect(margin, y, contentWidth, 12, 'F');
        doc.setTextColor(79, 70, 229);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(` Prelude (Wird) : ${dream.wirdDone}`, margin + 3, y + 8);
        y += 18;
      }

      // Content (Récit)
      doc.setTextColor(55, 65, 81);
      doc.setFont('times', 'normal');
      doc.setFontSize(11.5);
      const contentLines = doc.splitTextToSize(dream.content, contentWidth);
      
      contentLines.forEach((line: string) => {
        if (y > pageHeight - 30) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 6;
      });
      y += 10;

      // Interpretation
      if (dream.interpretation) {
        if (y > pageHeight - 60) {
          doc.addPage();
          y = 20;
        }

        doc.setFillColor(240, 242, 254);
        doc.setDrawColor(129, 140, 248);
        doc.setLineWidth(1);
        
        const interpretationLines = doc.splitTextToSize(dream.interpretation, contentWidth - 10);
        const boxHeight = (interpretationLines.length * 6) + 12;

        doc.rect(margin, y, contentWidth, boxHeight, 'F');
        doc.line(margin, y, margin, y + boxHeight);

        doc.setTextColor(79, 70, 229);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text("INTERPRETATION (TA'BIR)", margin + 5, y + 8);

        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        let tempY = y + 14;
        interpretationLines.forEach((line: string) => {
          doc.text(line, margin + 5, tempY);
          tempY += 6;
        });
      }

      // Footer
      const totalPages = (doc.internal as any).pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setTextColor(156, 163, 175);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.text(`Genere par Asrar - Page ${i} sur ${totalPages}`, margin, pageHeight - 10);
      }

      doc.save(`reve-${dream.id}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Erreur lors de la generation du PDF");
    }
  };

  // PDF Export helper for all dreams
  const exportAllToPDF = () => {
    if (dreams.length === 0) {
      alert("Aucun reve a exporter.");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Header Banner (Indigo-600)
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, pageWidth, 45, 'F');

      // Title inside banner
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('ASRAR - JOURNAL DES REVES', margin, 25);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Recueil complet - ${dreams.length} reve(s) documente(s)`, margin, 35);

      let y = 60;

      dreams.forEach((dream, index) => {
        if (index > 0) {
          doc.addPage();
          y = 20;
        }

        // Title of the dream
        doc.setTextColor(31, 41, 55);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        const titleLines = doc.splitTextToSize(`${index + 1}. ${dream.title}`, contentWidth);
        doc.text(titleLines, margin, y);
        y += (titleLines.length * 7) + 4;

        // Date and type
        doc.setTextColor(107, 114, 128);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        const formattedDate = new Date(dream.date).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        const typeLabel = dream.type === 'rahmani' ? 'Rahmani (Veridique)' :
                          dream.type === 'nafsani' ? 'Nafsani (Psychologique)' :
                          dream.type === 'shaytani' ? 'Shaytani (Cauchemar)' : 'Non defini';
        doc.text(`Date : ${formattedDate}   |   Type : ${typeLabel}`, margin, y);
        y += 8;

        // Divider
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        // Prelude Wird
        if (dream.wirdDone) {
          doc.setFillColor(243, 244, 246);
          doc.rect(margin, y, contentWidth, 10, 'F');
          doc.setTextColor(79, 70, 229);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.text(` Prelude (Wird) : ${dream.wirdDone}`, margin + 3, y + 7);
          y += 15;
        }

        // Content
        doc.setTextColor(55, 65, 81);
        doc.setFont('times', 'normal');
        doc.setFontSize(11);
        const contentLines = doc.splitTextToSize(dream.content, contentWidth);
        
        contentLines.forEach((line: string) => {
          if (y > pageHeight - 30) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += 5.5;
        });
        y += 8;

        // Interpretation
        if (dream.interpretation) {
          if (y > pageHeight - 50) {
            doc.addPage();
            y = 20;
          }

          doc.setFillColor(240, 242, 254);
          doc.setDrawColor(129, 140, 248);
          doc.setLineWidth(0.8);
          
          const interpretationLines = doc.splitTextToSize(dream.interpretation, contentWidth - 10);
          const boxHeight = (interpretationLines.length * 5) + 10;

          doc.rect(margin, y, contentWidth, boxHeight, 'F');
          doc.line(margin, y, margin, y + boxHeight);

          doc.setTextColor(79, 70, 229);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text("INTERPRETATION (TA'BIR)", margin + 4, y + 6);

          doc.setTextColor(30, 41, 59);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          
          let tempY = y + 11;
          interpretationLines.forEach((line: string) => {
            doc.text(line, margin + 4, tempY);
            tempY += 5;
          });
          y += boxHeight + 10;
        }
      });

      // Footer
      const totalPages = (doc.internal as any).pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setTextColor(156, 163, 175);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.text(`Genere par Asrar - Page ${i} sur ${totalPages}`, margin, pageHeight - 10);
      }

      doc.save('journal-reves-complet.pdf');
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Erreur lors de la generation du PDF");
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

  const handleInterpret = async () => {
    if (!title || !content) {
      alert("Veuillez remplir le titre et le récit du rêve d'abord.");
      return;
    }
    setIsInterpreting(true);
    try {
      const res = await fetch(getApiUrl('/api/dreams/interpret'), {
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
      alert("Erreur réseau");
    } finally {
      setIsInterpreting(false);
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
        <div className="flex items-center gap-3">
          {dreams.length > 0 && (
            <button 
              onClick={exportAllToPDF}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-750 rounded-xl text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm font-semibold text-sm active:scale-95"
              title="Exporter tout en PDF"
            >
              <Download size={18} className="text-indigo-500" />
              <span className="hidden sm:inline">Exporter PDF</span>
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
        {dreams.length === 0 && !isEditorOpen && (
          <div className="text-center py-12">
            <Moon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun rêve documenté.</p>
          </div>
        )}

        {dreams.map(dream => {
          const isExpanded = expandedDreamIds.has(dream.id);
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
                    exportSingleToPDF(dream);
                  }}
                  className="text-gray-400 hover:text-indigo-500 transition-colors p-1 rounded-lg"
                  title="Exporter ce rêve en PDF"
                >
                  <Download size={18} />
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
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 font-medium">
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
