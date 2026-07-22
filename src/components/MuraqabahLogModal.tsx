import React, { useState, useEffect } from 'react';
import { X, BookOpen, Sparkles, Moon, Download, Plus, Trash2, Check, Eye, Heart, Compass, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface MuraqabahEntry {
  id: string;
  hijriYear: number;
  hijriMonthIndex: number;
  hijriMonthName: string;
  hijriDay: number;
  phaseName: string;
  dateString: string;
  spiritualState: 'fana' | 'muraqabah' | 'kashf' | 'sakinah' | 'shukr';
  zikrCount: number;
  visionNotes: string;
  savedIntention: string;
  createdAt: number;
}

interface MuraqabahLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHijriYear: number;
  currentHijriMonthIndex: number;
  currentHijriMonthName: string;
  currentHijriDay: number;
  currentPhaseName?: string;
  language: string;
}

export const MuraqabahLogModal: React.FC<MuraqabahLogModalProps> = ({
  isOpen,
  onClose,
  currentHijriYear,
  currentHijriMonthIndex,
  currentHijriMonthName,
  currentHijriDay,
  currentPhaseName = "Phase Lunaire Sacrée",
  language
}) => {
  const [entries, setEntries] = useState<MuraqabahEntry[]>(() => {
    try {
      const stored = localStorage.getItem('asrar_muraqabah_journal');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  
  // Form State
  const [spiritualState, setSpiritualState] = useState<'fana' | 'muraqabah' | 'kashf' | 'sakinah' | 'shukr'>('muraqabah');
  const [zikrCount, setZikrCount] = useState<number>(100);
  const [visionNotes, setVisionNotes] = useState<string>('');
  const [savedIntention, setSavedIntention] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('asrar_muraqabah_journal', JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = () => {
    const newEntry: MuraqabahEntry = {
      id: Date.now().toString(),
      hijriYear: currentHijriYear,
      hijriMonthIndex: currentHijriMonthIndex,
      hijriMonthName: currentHijriMonthName,
      hijriDay: currentHijriDay,
      phaseName: currentPhaseName,
      dateString: new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US'),
      spiritualState,
      zikrCount,
      visionNotes,
      savedIntention,
      createdAt: Date.now()
    };

    setEntries([newEntry, ...entries]);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setActiveTab('history');
      setVisionNotes('');
      setSavedIntention('');
    }, 1200);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const handleExportJournal = () => {
    const jsonStr = JSON.stringify(entries, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal_muraqabah_${currentHijriYear}_${currentHijriMonthIndex + 1}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const isBadrDays = currentHijriDay >= 13 && currentHijriDay <= 15;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10060] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
      >
        <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0c0a14] border border-amber-500/30 rounded-3xl p-5 sm:p-7 text-white flex flex-col justify-between overflow-hidden shadow-2xl shadow-amber-500/10 z-10">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-amber-500/20 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
                  <BookOpen size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                    {language === 'fr' ? "JOURNAL DE RETRAITE LUNAIRE" : language === 'ha' ? "LITTAFIN MURAQABAH" : "LUNAR RETREAT LOG"}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-amber-200">
                    Muraqabah Log (Zikr & Visions)
                  </h3>
                </div>
              </div>

              {isBadrDays && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-[10px] font-black text-amber-300">
                  <Moon size={11} className="fill-amber-300" />
                  {language === 'fr' ? "✦ Nuitees Sacrées de la Pleine Lune (Al-Badr)" : "✦ Sacred Full Moon Retreat Nights (Al-Badr)"}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 hover:text-white rounded-full border border-amber-500/30 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-black/50 p-1 rounded-xl border border-amber-500/20 mb-4">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'new'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Plus size={14} />
              {language === 'fr' ? "Nouvelle Entrée Muraqabah" : "New Retreat Entry"}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen size={14} />
              {language === 'fr' ? `Historique (${entries.length})` : `History (${entries.length})`}
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            {activeTab === 'new' ? (
              <div className="space-y-3.5">
                {/* Active Moon Phase Summary */}
                <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">
                      {language === 'fr' ? "Phase & Jour Hijri" : "Phase & Hijri Day"}
                    </span>
                    <strong className="text-amber-300 font-bold">
                      Jour {currentHijriDay} {currentHijriMonthName} ({currentPhaseName})
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 block">
                      {language === 'fr' ? "Année Hijri" : "Hijri Year"}
                    </span>
                    <strong className="text-amber-400 font-mono">{currentHijriYear} AH</strong>
                  </div>
                </div>

                {/* State of Mind / Spiritual State Selection */}
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block mb-1">
                    {language === 'fr' ? "État Spirituel Majeur (Hal)" : "Spiritual State (Hal)"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { id: 'sakinah', label: 'Sakinah (Sérénité)' },
                      { id: 'muraqabah', label: 'Muraqabah (Contemplation)' },
                      { id: 'kashf', label: 'Kashf (Illumination)' },
                      { id: 'shukr', label: 'Shukr (Gratitude)' },
                      { id: 'fana', label: 'Fana (Absorption)' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setSpiritualState(st.id as any)}
                        className={`py-2 px-2 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                          spiritualState === st.id
                            ? 'bg-amber-500 text-black border-amber-400 shadow-md font-extrabold'
                            : 'bg-black/40 text-gray-300 border-amber-500/20 hover:border-amber-500/40'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zikr Count */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                      {language === 'fr' ? "Compteur de Zikr Accomplis" : "Completed Zikr Count"}
                    </label>
                    <span className="text-xs font-mono font-bold text-amber-300">{zikrCount} x</span>
                  </div>
                  <input
                    type="range"
                    min="33"
                    max="1000"
                    step="33"
                    value={zikrCount}
                    onChange={(e) => setZikrCount(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Saved Intention / Niyyah */}
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block mb-1">
                    {language === 'fr' ? "Intention Sacrée & Niyyah de la Phase" : "Sacred Intention & Niyyah"}
                  </label>
                  <input
                    type="text"
                    value={savedIntention}
                    onChange={(e) => setSavedIntention(e.target.value)}
                    placeholder={language === 'fr' ? "Ex: Clarté du cœur, paix familiale, subsistance bénie..." : "Ex: Heart clarity, family peace..."}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Vision / Experience Notes */}
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block mb-1">
                    {language === 'fr' ? "Notes de Retraite, Rêves & Visions (Kashf)" : "Retreat Notes & Visions"}
                  </label>
                  <textarea
                    rows={4}
                    value={visionNotes}
                    onChange={(e) => setVisionNotes(e.target.value)}
                    placeholder={language === 'fr' ? "Consignez ici vos ressentis, intuitions, rêves et expériences mystiques pendant cette nuit de Zikr..." : "Write down your spiritual insights and dream visions here..."}
                    className="w-full p-3 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleSaveEntry}
                  disabled={isSaved}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {isSaved ? (
                    <>
                      <Check size={16} />
                      {language === 'fr' ? "Entrée Muraqabah Enregistrée !" : "Entry Saved!"}
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      {language === 'fr' ? "Enregistrer dans le Journal Muraqabah" : "Save to Muraqabah Log"}
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <BookOpen size={32} className="mx-auto mb-2 opacity-30 text-amber-400" />
                    <p className="text-xs">
                      {language === 'fr' ? "Aucune entrée de retraite pour le moment." : "No retreat entries yet."}
                    </p>
                  </div>
                ) : (
                  entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-black/50 border border-amber-500/25 rounded-2xl p-3.5 space-y-2 relative group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                              {entry.spiritualState.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {entry.dateString}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-amber-200 mt-1">
                            Jour {entry.hijriDay} {entry.hijriMonthName} ({entry.phaseName})
                          </h5>
                        </div>

                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {entry.savedIntention && (
                        <div className="text-[11px] text-amber-300 italic bg-amber-950/30 p-2 rounded-lg border border-amber-500/20">
                          <strong>Intention : </strong> {entry.savedIntention}
                        </div>
                      )}

                      {entry.visionNotes && (
                        <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5">
                          "{entry.visionNotes}"
                        </p>
                      )}

                      <div className="text-[10px] text-amber-400/80 font-mono">
                        Zikr total : <strong>{entry.zikrCount} x</strong>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-4 pt-3 border-t border-amber-500/20 flex justify-between items-center">
            <span className="text-[10px] text-gray-400">
              {entries.length} {language === 'fr' ? "expériences consignées" : "recorded experiences"}
            </span>

            {entries.length > 0 && (
              <button
                onClick={handleExportJournal}
                className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 rounded-xl border border-amber-500/30 text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download size={12} />
                {language === 'fr' ? "Exporter le Journal (JSON)" : "Export Log (JSON)"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
