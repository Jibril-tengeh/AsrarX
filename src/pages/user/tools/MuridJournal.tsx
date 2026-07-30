import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Check, Plus, Trash2, Sparkles, Moon } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { getApiUrl } from '../../../lib/api';

interface MuridLogEntry {
  id: string;
  date: string;
  zikrTitle: string;
  count: number;
  notes: string;
  type: 'zikr' | 'dream' | 'arbain';
  interpretation?: string;
}

const dicts = {
  fr: {
    title: "Carnet de Bord du Murīd",
    subtitle: "Journal Spirituel Personnel & Suivi de la Retraite des 40 Jours (Arba'īn)",
    arbainTitle: "Retraite Spirituelle (Arba'īn - 40 Jours)",
    daysCountLabel: "Jours",
    intentionLabel: "Intention de la Retraite",
    defaultIntention: "40 Jours de Dhikr & Purification",
    addNoteTitle: "Ajouter une Note au Carnet",
    dailyZikr: "Zikr Quotidien",
    dreamVision: "🌙 Rêve / Vision",
    arbain: "Arba'īn",
    titlePlaceholderDream: "Titre du Rêve (ex: Rêve de la Clé dorée)",
    titlePlaceholderZikr: "Titre (ex: Zikr Ya Rahim)",
    repetitionsPlaceholder: "Répétitions",
    ibnSirinAvail: "Interprétation Ibn Sirin disponible",
    notesPlaceholderDream: "Racontez votre rêve en détail...",
    notesPlaceholderZikr: "Notes spirituelles, ressentis ou visions durant la séance...",
    saveBtn: "Enregistrer dans le Carnet",
    historyTitle: "Historique du Carnet",
    fullDreamLog: "Journal des Rêves Complet →",
    noEntries: "Aucune note enregistrée dans votre carnet.",
    dreamBadge: "🌙 Rêve",
    interpreting: "Analyse...",
    interpretBtn: "Interpréter (Ibn Sirin)",
    ibnSirinHeader: "Interprétation d'Ibn Sirin & Savants",
    defaultZikrTitle: "Ya Latif (129x)",
    defaultNotes: "Séance de matinée apaisante et sereine."
  },
  en: {
    title: "Murīd Spiritual Logbook",
    subtitle: "Personal Spiritual Journal & 40-Day Retreat (Arba'īn) Tracker",
    arbainTitle: "Spiritual Retreat (Arba'īn - 40 Days)",
    daysCountLabel: "Days",
    intentionLabel: "Retreat Intention",
    defaultIntention: "40 Days of Dhikr & Purification",
    addNoteTitle: "Add a Note to Logbook",
    dailyZikr: "Daily Zikr",
    dreamVision: "🌙 Dream / Vision",
    arbain: "Arba'īn",
    titlePlaceholderDream: "Dream Title (e.g. Dream of the Golden Key)",
    titlePlaceholderZikr: "Title (e.g. Zikr Ya Rahim)",
    repetitionsPlaceholder: "Repetitions",
    ibnSirinAvail: "Ibn Sirin Interpretation Available",
    notesPlaceholderDream: "Describe your dream in detail...",
    notesPlaceholderZikr: "Spiritual notes, feelings, or visions during session...",
    saveBtn: "Save to Logbook",
    historyTitle: "Logbook History",
    fullDreamLog: "Full Dream Journal →",
    noEntries: "No notes saved in your logbook.",
    dreamBadge: "🌙 Dream",
    interpreting: "Analyzing...",
    interpretBtn: "Interpret (Ibn Sirin)",
    ibnSirinHeader: "Ibn Sirin & Scholars Interpretation",
    defaultZikrTitle: "Ya Latif (129x)",
    defaultNotes: "Calming and serene morning session."
  },
  ha: {
    title: "Kwandatsin Mujallan Murīd",
    subtitle: "Mujallan Ruhaniya na Murid da Binciken Arba'in (Kwanki 40)",
    arbainTitle: "Yin Babi / Khalwa na Ruhaniya (Arba'īn - Ranakun 40)",
    daysCountLabel: "Ranakun",
    intentionLabel: "Niyyar Yin Khalwa",
    defaultIntention: "Kwanaki 40 na Ambato (Zikr) da Tsarkake Zuciya",
    addNoteTitle: "Ƙara Bayani a Mujalla",
    dailyZikr: "Ambato na Yau da Kullum",
    dreamVision: "🌙 Mafarki / Tunanin Ruhu",
    arbain: "Arba'īn",
    titlePlaceholderDream: "Kan Labarin Mafarki (misali: Mafarkin Maƙalli)",
    titlePlaceholderZikr: "Kan Magana (misali: Zikr Ya Rahim)",
    repetitionsPlaceholder: "Lamba/Yawan Zikr",
    ibnSirinAvail: "Akwai fassarar Ibn Sirin",
    notesPlaceholderDream: "Raita labarin mafarkinka daki-daki...",
    notesPlaceholderZikr: "Bayanai na ruhaniya ko abubuwan da ka ji a lokacin zikr...",
    saveBtn: "Ajiye a Mujalla",
    historyTitle: "Tarihin Mujalla",
    fullDreamLog: "Cikakken Mujallan Mafarki →",
    noEntries: "Babu wani bayani da aka ajiye a mujallarka.",
    dreamBadge: "🌙 Mafarki",
    interpreting: "Ana fassara...",
    interpretBtn: "Fassara (Ibn Sirin)",
    ibnSirinHeader: "Fassarar Ibn Sirin da Malaman Musulunci",
    defaultZikrTitle: "Ya Latif (129x)",
    defaultNotes: "Zaman ambato na safe mai nutsuwa."
  }
};

export const MuridJournal: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const dict = dicts[(language as 'fr' | 'en' | 'ha')] || dicts.fr;

  // 40-Day Arba'in Retreat State
  const [arbainProgress, setArbainProgress] = useState<boolean[]>(() => {
    const saved = localStorage.getItem('asrarhub_arbain_days');
    return saved ? JSON.parse(saved) : Array(40).fill(false);
  });

  const [arbainIntention, setArbainIntention] = useState<string>(() => {
    return localStorage.getItem('asrarhub_arbain_intention') || dict.defaultIntention;
  });

  // Journal Entries State
  const [entries, setEntries] = useState<MuridLogEntry[]>(() => {
    const saved = localStorage.getItem('asrarhub_murid_entries');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            date: new Date().toISOString().split('T')[0],
            zikrTitle: dict.defaultZikrTitle,
            count: 129,
            notes: dict.defaultNotes,
            type: 'zikr',
          },
        ];
  });

  // New Entry Modal Form
  const [newTitle, setNewTitle] = useState('');
  const [newCount, setNewCount] = useState<number>(100);
  const [newNotes, setNewNotes] = useState('');
  const [newType, setNewType] = useState<'zikr' | 'dream' | 'arbain'>('zikr');
  const [isInterpreting, setIsInterpreting] = useState(false);

  useEffect(() => {
    localStorage.setItem('asrarhub_arbain_days', JSON.stringify(arbainProgress));
  }, [arbainProgress]);

  useEffect(() => {
    localStorage.setItem('asrarhub_arbain_intention', arbainIntention);
  }, [arbainIntention]);

  useEffect(() => {
    localStorage.setItem('asrarhub_murid_entries', JSON.stringify(entries));
  }, [entries]);

  const toggleArbainDay = (index: number) => {
    const copy = [...arbainProgress];
    copy[index] = !copy[index];
    setArbainProgress(copy);
  };

  const handleInterpretEntry = async (entryId: string, title: string, content: string) => {
    if (!content.trim()) return;
    setIsInterpreting(true);
    try {
      const res = await fetch(getApiUrl('/api/dreams/interpret'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, type: 'Vision/Rêve', wirdDone: 'Zikr du Murīd', language })
      });
      const data = await res.json();
      if (data.interpretation) {
        setEntries(prev => prev.map(e => e.id === entryId ? { ...e, interpretation: data.interpretation } : e));
      }
    } catch (err) {
      console.error("Dream interpretation error:", err);
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const entry: MuridLogEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      zikrTitle: newTitle,
      count: newCount,
      notes: newNotes,
      type: newType,
    };

    setEntries([entry, ...entries]);
    setNewTitle('');
    setNewNotes('');
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const completedArbainCount = arbainProgress.filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>{dict.title}</span>
            <BookOpen className="w-6 h-6 text-emerald-500" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {dict.subtitle}
          </p>
        </div>
        <ToolInfoTooltip toolId="murid-journal" />
      </div>

      {/* Section 1: 40-Day Arba'in Challenge Tracker */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-3xl border border-emerald-800/50 shadow-xl mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <h2 className="text-lg font-bold font-serif">{dict.arbainTitle}</h2>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-800/80 text-amber-800 dark:text-amber-300 border border-amber-500/30">
            {completedArbainCount} / 40 {dict.daysCountLabel}
          </span>
        </div>

        <div>
          <label className="block text-xs text-emerald-300 mb-1">{dict.intentionLabel}</label>
          <input
            type="text"
            value={arbainIntention}
            onChange={(e) => setArbainIntention(e.target.value)}
            className="w-full bg-emerald-950/60 border border-emerald-700/50 px-4 py-2 rounded-xl text-xs font-serif text-amber-800 dark:text-amber-200 outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* 40 Days Grid */}
        <div className="grid grid-cols-8 sm:grid-cols-10 gap-2 pt-2">
          {arbainProgress.map((done, idx) => (
            <button
              key={idx}
              onClick={() => toggleArbainDay(idx)}
              className={`aspect-square rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center cursor-pointer ${
                done
                  ? 'bg-amber-500 text-zinc-950 shadow-md scale-105'
                  : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 hover:bg-emerald-800'
              }`}
            >
              {done ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Add New Journal Log */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" />
            <span>{dict.addNoteTitle}</span>
          </h3>
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setNewType('zikr')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${newType === 'zikr' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              {dict.dailyZikr}
            </button>
            <button
              type="button"
              onClick={() => setNewType('dream')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${newType === 'dream' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              {dict.dreamVision}
            </button>
            <button
              type="button"
              onClick={() => setNewType('arbain')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${newType === 'arbain' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              {dict.arbain}
            </button>
          </div>
        </div>

        <form onSubmit={handleAddEntry} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={newType === 'dream' ? dict.titlePlaceholderDream : dict.titlePlaceholderZikr}
              className="sm:col-span-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {newType !== 'dream' ? (
              <input
                type="number"
                value={newCount}
                onChange={(e) => setNewCount(Number(e.target.value))}
                placeholder={dict.repetitionsPlaceholder}
                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <div className="flex items-center px-3 py-2 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 rounded-xl text-[11px] font-bold border border-purple-200 dark:border-purple-800">
                <span>{dict.ibnSirinAvail}</span>
              </div>
            )}
          </div>

          <textarea
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            placeholder={newType === 'dream' ? dict.notesPlaceholderDream : dict.notesPlaceholderZikr}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
          />

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{dict.saveBtn}</span>
          </button>
        </form>
      </div>

      {/* Section 3: Entries List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-widest flex items-center justify-between">
          <span>{dict.historyTitle}</span>
          <Link to="/tools/dreams" className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1">
            <Moon size={14} />
            <span>{dict.fullDreamLog}</span>
          </Link>
        </h3>

        {entries.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-6">{dict.noEntries}</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{entry.zikrTitle}</span>
                    {entry.type === 'dream' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                        {dict.dreamBadge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold">
                        {entry.count}x
                      </span>
                    )}
                    <span className="text-[10px] text-gray-600 dark:text-gray-300 font-mono">{entry.date}</span>
                  </div>
                  {entry.notes && <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{entry.notes}</p>}
                </div>

                <div className="flex items-center gap-2">
                  {entry.type === 'dream' && !entry.interpretation && (
                    <button
                      onClick={() => handleInterpretEntry(entry.id, entry.zikrTitle, entry.notes)}
                      disabled={isInterpreting}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-1 shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles size={12} />
                      {isInterpreting ? dict.interpreting : dict.interpretBtn}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {entry.interpretation && (
                <div className="bg-gradient-to-br from-purple-50/80 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 p-4 rounded-xl border border-purple-200/50 dark:border-purple-800/40 text-xs leading-relaxed space-y-2">
                  <div className="flex items-center justify-between font-bold text-purple-800 dark:text-purple-300">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={14} className="text-purple-600 dark:text-purple-400" />
                      {dict.ibnSirinHeader}
                    </span>
                  </div>
                  <div className="prose dark:prose-invert max-w-none text-xs text-gray-700 dark:text-gray-300">
                    <Markdown remarkPlugins={[remarkGfm]}>{entry.interpretation}</Markdown>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

