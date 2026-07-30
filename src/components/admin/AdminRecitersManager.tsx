import React, { useState, useMemo } from 'react';
import { 
  Headphones, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Globe, 
  RotateCcw, 
  ShieldCheck, 
  Music, 
  Volume2, 
  Filter,
  Check,
  Star,
  Radio
} from 'lucide-react';
import { 
  QuranReciter, 
  QURAN_RECITERS 
} from '../../data/reciters';
import { 
  ReciterOption, 
  SACRED_RECITERS 
} from '../ContemplativeAudioPlayer';
import { 
  getAllQuranReciters, 
  getAllSacredReciters, 
  toggleQuranReciter, 
  toggleSacredReciter, 
  bulkUpdateQuranReciters, 
  bulkUpdateSacredReciters, 
  saveQuranReciter, 
  saveSacredReciter, 
  deleteCustomQuranReciter, 
  deleteCustomSacredReciter,
  ManagedQuranReciter,
  ManagedSacredReciter
} from '../../utils/reciterManager';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface AdminRecitersManagerProps {
  featureToggles: any;
  handleToggleFeature: (featureId: string, currentValue: any) => Promise<void>;
}

export const AdminRecitersManager: React.FC<AdminRecitersManagerProps> = ({
  featureToggles,
  handleToggleFeature
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quran' | 'sacred'>('quran');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  
  // Audio preview state
  const [previewingAudioUrl, setPreviewingAudioUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuranReciter, setEditingQuranReciter] = useState<ManagedQuranReciter | null>(null);
  const [editingSacredReciter, setEditingSacredReciter] = useState<ManagedSacredReciter | null>(null);

  // Form inputs for Quran Reciter
  const [quranForm, setQuranForm] = useState<QuranReciter>({
    id: '',
    name: '',
    nameAr: '',
    country: 'Arabie Saoudite',
    server: 'https://server6.mp3quran.net/akdr/',
    apiId: 'ar.alafasy',
    hasDirectApi: true
  });

  // Form inputs for Sacred Reciter
  const [sacredForm, setSacredForm] = useState<ReciterOption>({
    id: '',
    nameFr: '',
    nameEn: '',
    shortName: ''
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Get lists from manager
  const allQuranReciters = useMemo(() => {
    return getAllQuranReciters(featureToggles);
  }, [featureToggles]);

  const allSacredReciters = useMemo(() => {
    return getAllSacredReciters(featureToggles);
  }, [featureToggles]);

  // Extract unique countries
  const countriesList = useMemo(() => {
    const set = new Set<string>();
    allQuranReciters.forEach(r => {
      if (r.country) set.add(r.country);
    });
    return Array.from(set).sort();
  }, [allQuranReciters]);

  // Statistics
  const quranStats = useMemo(() => {
    const total = allQuranReciters.length;
    const enabled = allQuranReciters.filter(r => r.enabled).length;
    const disabled = total - enabled;
    const custom = allQuranReciters.filter(r => r.isCustom).length;
    return { total, enabled, disabled, custom };
  }, [allQuranReciters]);

  const sacredStats = useMemo(() => {
    const total = allSacredReciters.length;
    const enabled = allSacredReciters.filter(r => r.enabled).length;
    const disabled = total - enabled;
    const custom = allSacredReciters.filter(r => r.isCustom).length;
    return { total, enabled, disabled, custom };
  }, [allSacredReciters]);

  // Filtered lists
  const filteredQuranReciters = useMemo(() => {
    return allQuranReciters.filter(r => {
      // Search
      const matchesSearch = 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.nameAr && r.nameAr.includes(searchQuery)) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.country.toLowerCase().includes(searchQuery.toLowerCase());

      // Status
      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'enabled' ? r.enabled :
        !r.enabled;

      // Country
      const matchesCountry = countryFilter === 'all' || r.country === countryFilter;

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [allQuranReciters, searchQuery, statusFilter, countryFilter]);

  const filteredSacredReciters = useMemo(() => {
    return allSacredReciters.filter(r => {
      const matchesSearch = 
        r.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'enabled' ? r.enabled :
        !r.enabled;

      return matchesSearch && matchesStatus;
    });
  }, [allSacredReciters, searchQuery, statusFilter]);

  // Audio Preview Handler
  const handlePlayPreview = (url: string) => {
    if (audioElement && previewingAudioUrl === url) {
      if (isPlayingPreview) {
        audioElement.pause();
        setIsPlayingPreview(false);
      } else {
        audioElement.play();
        setIsPlayingPreview(true);
      }
      return;
    }

    if (audioElement) {
      audioElement.pause();
    }

    const newAudio = new Audio(url);
    newAudio.play().then(() => {
      setIsPlayingPreview(true);
      setPreviewingAudioUrl(url);
    }).catch(err => {
      console.error("Audio preview playback error:", err);
      showToast("Impossible de lire l'audio d'extrait pour ce récitateur.");
    });

    newAudio.onended = () => {
      setIsPlayingPreview(false);
    };

    setAudioElement(newAudio);
  };

  // Toggle Single Reciter
  const handleToggleQuran = async (r: ManagedQuranReciter) => {
    try {
      await toggleQuranReciter(featureToggles, r.id, !r.enabled);
      showToast(r.enabled ? `Récitateur "${r.name}" désactivé` : `Récitateur "${r.name}" activé`);
    } catch (err) {
      console.error("Toggle error:", err);
      showToast("Erreur lors de la modification de l'état");
    }
  };

  const handleToggleSacred = async (r: ManagedSacredReciter) => {
    try {
      await toggleSacredReciter(featureToggles, r.id, !r.enabled);
      showToast(r.enabled ? `Récitateur sacré "${r.shortName}" désactivé` : `Récitateur sacré "${r.shortName}" activé`);
    } catch (err) {
      console.error("Toggle error:", err);
      showToast("Erreur lors de la modification de l'état");
    }
  };

  // Bulk Updates
  const handleBulkQuran = async (action: 'enable_all' | 'disable_all' | 'reset') => {
    if (action === 'disable_all' && !window.confirm("Êtes-vous sûr de vouloir désactiver TOUS les récitateurs du Coran ?")) {
      return;
    }
    if (action === 'reset' && !window.confirm("Réinitialiser les récitateurs rétablira la liste d'origine par défaut.")) {
      return;
    }
    try {
      await bulkUpdateQuranReciters(featureToggles, action);
      showToast("Action groupée effectuée avec succès !");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'action groupée");
    }
  };

  const handleBulkSacred = async (action: 'enable_all' | 'disable_all' | 'reset') => {
    if (action === 'disable_all' && !window.confirm("Êtes-vous sûr de vouloir désactiver TOUS les récitateurs sacrés ?")) {
      return;
    }
    try {
      await bulkUpdateSacredReciters(featureToggles, action);
      showToast("Action groupée effectuée avec succès !");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'action groupée");
    }
  };

  // Default Reciter Setter
  const handleSetDefaultQuranReciter = async (reciterId: string, reciterName: string) => {
    try {
      await handleToggleFeature('default_reciter_id', reciterId);
      showToast(`"${reciterName}" est maintenant le récitateur du Coran par défaut du système !`);
    } catch (err) {
      showToast("Erreur lors de la mise à jour du récitateur par défaut.");
    }
  };

  const handleSetDefaultSacredReciter = async (reciterId: string, reciterName: string) => {
    try {
      await handleToggleFeature('sacred_default_reciter_id', reciterId);
      showToast(`"${reciterName}" est maintenant le récitateur sacré par défaut !`);
    } catch (err) {
      showToast("Erreur lors de la mise à jour du récitateur sacré par défaut.");
    }
  };

  // Open Modal for Create / Edit
  const handleOpenAddQuranModal = () => {
    setEditingQuranReciter(null);
    setQuranForm({
      id: `custom-reciter-${Date.now()}`,
      name: '',
      nameAr: '',
      country: 'Arabie Saoudite',
      server: 'https://server6.mp3quran.net/',
      apiId: 'ar.alafasy',
      hasDirectApi: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditQuranModal = (r: ManagedQuranReciter) => {
    setEditingQuranReciter(r);
    setQuranForm({
      id: r.id,
      name: r.name,
      nameAr: r.nameAr || '',
      country: r.country || 'Autre',
      server: r.server || '',
      apiId: r.apiId || 'ar.alafasy',
      hasDirectApi: r.hasDirectApi ?? true
    });
    setIsModalOpen(true);
  };

  const handleOpenAddSacredModal = () => {
    setEditingSacredReciter(null);
    setSacredForm({
      id: `sacred-custom-${Date.now()}`,
      nameFr: '',
      nameEn: '',
      shortName: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditSacredModal = (r: ManagedSacredReciter) => {
    setEditingSacredReciter(r);
    setSacredForm({
      id: r.id,
      nameFr: r.nameFr,
      nameEn: r.nameEn,
      shortName: r.shortName
    });
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveQuranForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quranForm.name.trim() || !quranForm.server.trim()) {
      showToast("Veuillez remplir le nom et le serveur audio.");
      return;
    }
    try {
      const isCustom = editingQuranReciter ? editingQuranReciter.isCustom ?? false : true;
      await saveQuranReciter(featureToggles, quranForm, isCustom);
      showToast(`Récitateur "${quranForm.name}" sauvegardé avec succès !`);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la sauvegarde.");
    }
  };

  const handleSaveSacredForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sacredForm.nameFr.trim() || !sacredForm.shortName.trim()) {
      showToast("Veuillez remplir le nom et le nom court.");
      return;
    }
    try {
      const isCustom = editingSacredReciter ? editingSacredReciter.isCustom ?? false : true;
      await saveSacredReciter(featureToggles, sacredForm, isCustom);
      showToast(`Récitateur sacré "${sacredForm.shortName}" sauvegardé avec succès !`);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la sauvegarde.");
    }
  };

  // Delete Custom Reciter
  const handleDeleteCustomQuran = async (r: ManagedQuranReciter) => {
    if (!window.confirm(`Supprimer définitivement le récitateur personnalisé "${r.name}" ?`)) return;
    try {
      await deleteCustomQuranReciter(featureToggles, r.id);
      showToast("Récitateur personnalisé supprimé.");
    } catch (err) {
      showToast("Erreur lors de la suppression.");
    }
  };

  const handleDeleteCustomSacred = async (r: ManagedSacredReciter) => {
    if (!window.confirm(`Supprimer définitivement le récitateur sacré personnalisé "${r.shortName}" ?`)) return;
    try {
      await deleteCustomSacredReciter(featureToggles, r.id);
      showToast("Récitateur sacré personnalisé supprimé.");
    } catch (err) {
      showToast("Erreur lors de la suppression.");
    }
  };

  const defaultQuranReciterId = featureToggles?.default_reciter_id || QURAN_RECITERS[0].id;
  const defaultSacredReciterId = featureToggles?.sacred_default_reciter_id || SACRED_RECITERS[0].id;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm animate-bounce">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-gray-900 p-6 rounded-3xl border border-emerald-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30 inline-block mb-2">
              Panneau Administrateur • Audio System
            </span>
            <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
              <Headphones className="text-emerald-400" size={30} />
              Gestion des Récitateurs du Coran
            </h2>
            <p className="text-sm text-emerald-100/80 mt-1 max-w-2xl">
              Activez, désactivez et paramétrez l'ensemble des récitations du Saint Coran. Les récitations désactivées seront automatiquement retirées des menus pour tous les utilisateurs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (activeSubTab === 'quran') handleOpenAddQuranModal();
                else handleOpenAddSacredModal();
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 cursor-pointer"
            >
              <Plus size={16} />
              <span>{activeSubTab === 'quran' ? 'Ajouter Récitateur Coran' : 'Ajouter Récitateur Sacré'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sub-Tab Switcher (Quran vs Sacred Audio Player) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('quran')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'quran'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Headphones size={18} />
            <span>Coran Complet ({quranStats.total})</span>
            <span className="text-xs bg-emerald-800/40 text-emerald-100 px-2 py-0.5 rounded-full font-mono">
              {quranStats.enabled} actifs
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('sacred')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'sacred'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Radio size={18} />
            <span>Récitateurs Contemplatifs ({sacredStats.total})</span>
            <span className="text-xs bg-emerald-800/40 text-emerald-100 px-2 py-0.5 rounded-full font-mono">
              {sacredStats.enabled} actifs
            </span>
          </button>
        </div>

        {/* Global Bulk Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              if (activeSubTab === 'quran') handleBulkQuran('enable_all');
              else handleBulkSacred('enable_all');
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Activer tous les récitateurs"
          >
            <CheckCircle2 size={14} />
            <span>Tout Activer</span>
          </button>

          <button
            onClick={() => {
              if (activeSubTab === 'quran') handleBulkQuran('disable_all');
              else handleBulkSacred('disable_all');
            }}
            className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-200 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Désactiver tous les récitateurs"
          >
            <XCircle size={14} />
            <span>Tout Désactiver</span>
          </button>

          <button
            onClick={() => {
              if (activeSubTab === 'quran') handleBulkQuran('reset');
              else handleBulkSacred('reset');
            }}
            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Réinitialiser la liste d'origine"
          >
            <RotateCcw size={14} />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom, nom en arabe, pays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Tous les états ({activeSubTab === 'quran' ? quranStats.total : sacredStats.total})</option>
              <option value="enabled">Actifs uniquement ({activeSubTab === 'quran' ? quranStats.enabled : sacredStats.enabled})</option>
              <option value="disabled">Désactivés uniquement ({activeSubTab === 'quran' ? quranStats.disabled : sacredStats.disabled})</option>
            </select>
          </div>

          {/* Country Filter (Quran only) */}
          {activeSubTab === 'quran' && (
            <div>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">Tous les pays ({countriesList.length})</option>
                {countriesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Counter Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-700">
          <span>
            Affichage de <strong className="text-gray-800 dark:text-gray-200">{activeSubTab === 'quran' ? filteredQuranReciters.length : filteredSacredReciters.length}</strong> récitateurs sur {activeSubTab === 'quran' ? quranStats.total : sacredStats.total}
          </span>
          {activeSubTab === 'quran' && (
            <span>
              Défaut Système : <strong className="text-emerald-600 dark:text-emerald-400">{allQuranReciters.find(r => r.id === defaultQuranReciterId)?.name || defaultQuranReciterId}</strong>
            </span>
          )}
          {activeSubTab === 'sacred' && (
            <span>
              Défaut Sacré : <strong className="text-emerald-600 dark:text-emerald-400">{allSacredReciters.find(r => r.id === defaultSacredReciterId)?.shortName || defaultSacredReciterId}</strong>
            </span>
          )}
        </div>
      </div>

      {/* ==================== TAB 1: QURAN RECITERS LIST ==================== */}
      {activeSubTab === 'quran' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuranReciters.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-gray-800 p-8 rounded-2xl text-center text-gray-500">
              <Headphones className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="font-bold">Aucun récitateur ne correspond à votre recherche.</p>
            </div>
          ) : (
            filteredQuranReciters.map((r) => {
              const isDefault = r.id === defaultQuranReciterId;
              const sampleAudioUrl = `${r.server}001.mp3`; // Surah Al-Fatiha MP3 sample

              return (
                <div
                  key={r.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative ${
                    !r.enabled
                      ? 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 opacity-60'
                      : isDefault
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/80 shadow-sm'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-emerald-500/50'
                  }`}
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mb-1">
                          {r.country}
                        </span>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug">
                          {r.name}
                        </h3>
                        {r.nameAr && (
                          <p className="text-sm font-serif text-amber-700 dark:text-amber-400 dir-rtl mt-0.5" style={{ fontFamily: '"Amiri", serif' }}>
                            {r.nameAr}
                          </p>
                        )}
                      </div>

                      {/* Enable/Disable Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleQuran(r)}
                        className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer ${
                          r.enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        title={r.enabled ? 'Cliquer pour désactiver' : 'Cliquer pour activer'}
                      >
                        <div
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                            r.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Metadata & Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 my-2">
                      {isDefault && (
                        <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <Star size={10} className="fill-current" /> Défaut Système
                        </span>
                      )}
                      {r.isCustom && (
                        <span className="text-[10px] font-bold bg-purple-500 text-white px-2 py-0.5 rounded-full">
                          Personnalisé
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        r.enabled 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                      }`}>
                        {r.enabled ? 'Actif' : 'Désactivé'}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-gray-400 truncate mt-1" title={r.server}>
                      {r.server}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
                    {/* Audio Test Button */}
                    <button
                      onClick={() => handlePlayPreview(sampleAudioUrl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        previewingAudioUrl === sampleAudioUrl && isPlayingPreview
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-emerald-500 hover:text-white'
                      }`}
                      title="Écouter un extrait audio (Sourate Al-Fatiha)"
                    >
                      {previewingAudioUrl === sampleAudioUrl && isPlayingPreview ? (
                        <>
                          <Pause size={13} /> <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play size={13} /> <span>Extrait Audio</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Set Default Button */}
                      {!isDefault && r.enabled && (
                        <button
                          onClick={() => handleSetDefaultQuranReciter(r.id, r.name)}
                          className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                          title="Définir comme récitateur par défaut du système"
                        >
                          <Star size={14} />
                        </button>
                      )}

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditQuranModal(r)}
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                        title="Modifier les paramètres du récitateur"
                      >
                        <Edit size={14} />
                      </button>

                      {/* Delete (if custom) */}
                      {r.isCustom && (
                        <button
                          onClick={() => handleDeleteCustomQuran(r)}
                          className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                          title="Supprimer ce récitateur personnalisé"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ==================== TAB 2: SACRED RECITERS LIST ==================== */}
      {activeSubTab === 'sacred' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSacredReciters.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-gray-800 p-8 rounded-2xl text-center text-gray-500">
              <Radio className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="font-bold">Aucun récitateur sacré ne correspond à votre recherche.</p>
            </div>
          ) : (
            filteredSacredReciters.map((r) => {
              const isDefault = r.id === defaultSacredReciterId;
              const sampleAudioUrl = `https://everyayah.com/data/${r.id}/001001.mp3`;

              return (
                <div
                  key={r.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative ${
                    !r.enabled
                      ? 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 opacity-60'
                      : isDefault
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/80 shadow-sm'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-emerald-500/50'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 mb-1">
                          Récitateur Vocal Sacré
                        </span>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug">
                          {r.nameFr}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {r.nameEn}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleSacred(r)}
                        className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer ${
                          r.enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        title={r.enabled ? 'Cliquer pour désactiver' : 'Cliquer pour activer'}
                      >
                        <div
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                            r.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 my-2">
                      {isDefault && (
                        <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <Star size={10} className="fill-current" /> Défaut Sacré
                        </span>
                      )}
                      {r.isCustom && (
                        <span className="text-[10px] font-bold bg-purple-500 text-white px-2 py-0.5 rounded-full">
                          Personnalisé
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        r.enabled 
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                      }`}>
                        {r.enabled ? 'Actif' : 'Désactivé'}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                      ID EveryAyah : <strong className="text-gray-800 dark:text-gray-200">{r.id}</strong>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handlePlayPreview(sampleAudioUrl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        previewingAudioUrl === sampleAudioUrl && isPlayingPreview
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      {previewingAudioUrl === sampleAudioUrl && isPlayingPreview ? (
                        <>
                          <Pause size={13} /> <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play size={13} /> <span>Extrait Audio</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      {!isDefault && r.enabled && (
                        <button
                          onClick={() => handleSetDefaultSacredReciter(r.id, r.shortName)}
                          className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                          title="Définir comme récitateur sacré par défaut"
                        >
                          <Star size={14} />
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEditSacredModal(r)}
                        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                        title="Modifier"
                      >
                        <Edit size={14} />
                      </button>

                      {r.isCustom && (
                        <button
                          onClick={() => handleDeleteCustomSacred(r)}
                          className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ==================== MODAL: ADD / EDIT RECITER ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Headphones className="text-emerald-500" size={20} />
                {activeSubTab === 'quran'
                  ? (editingQuranReciter ? 'Modifier le Récitateur du Coran' : 'Ajouter un Récitateur du Coran')
                  : (editingSacredReciter ? 'Modifier le Récitateur Sacré' : 'Ajouter un Récitateur Sacré')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* FORM FOR QURAN RECITER */}
            {activeSubTab === 'quran' && (
              <form onSubmit={handleSaveQuranForm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    ID Récitateur (Unique)
                  </label>
                  <input
                    type="text"
                    disabled={!!editingQuranReciter && !editingQuranReciter.isCustom}
                    value={quranForm.id}
                    onChange={(e) => setQuranForm({ ...quranForm, id: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono text-gray-800 dark:text-gray-200"
                    placeholder="mp3quran-custom-1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nom du Récitateur (Français / Translitéré)
                  </label>
                  <input
                    type="text"
                    value={quranForm.name}
                    onChange={(e) => setQuranForm({ ...quranForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200"
                    placeholder="Cheikh Mishary Rashid Alafasy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nom en Arabe (avec ou sans Tashkeel)
                  </label>
                  <input
                    type="text"
                    value={quranForm.nameAr}
                    onChange={(e) => setQuranForm({ ...quranForm, nameAr: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 dir-rtl font-serif"
                    placeholder="مشاري بن راشد العفاسي"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Pays / Origine
                  </label>
                  <input
                    type="text"
                    value={quranForm.country}
                    onChange={(e) => setQuranForm({ ...quranForm, country: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200"
                    placeholder="Koweït, Arabie Saoudite, Égypte..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Serveur Audio (URL MP3 terminant par un slash `/`)
                  </label>
                  <input
                    type="url"
                    value={quranForm.server}
                    onChange={(e) => setQuranForm({ ...quranForm, server: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono text-gray-800 dark:text-gray-200"
                    placeholder="https://server6.mp3quran.net/akdr/"
                    required
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Exemple: L'audio de la Sourate 1 sera extrait depuis <code className="text-amber-500">{quranForm.server || '...'}001.mp3</code>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Identifiant API AlQuran Cloud (optionnel)
                  </label>
                  <input
                    type="text"
                    value={quranForm.apiId}
                    onChange={(e) => setQuranForm({ ...quranForm, apiId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono text-gray-800 dark:text-gray-200"
                    placeholder="ar.alafasy"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            )}

            {/* FORM FOR SACRED RECITER */}
            {activeSubTab === 'sacred' && (
              <form onSubmit={handleSaveSacredForm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    ID EveryAyah / Folder ID
                  </label>
                  <input
                    type="text"
                    disabled={!!editingSacredReciter && !editingSacredReciter.isCustom}
                    value={sacredForm.id}
                    onChange={(e) => setSacredForm({ ...sacredForm, id: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono text-gray-800 dark:text-gray-200"
                    placeholder="Alafasy_128kbps"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nom Français
                  </label>
                  <input
                    type="text"
                    value={sacredForm.nameFr}
                    onChange={(e) => setSacredForm({ ...sacredForm, nameFr: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200"
                    placeholder="Cheikh Mishary Rashid Alafasy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nom Anglais
                  </label>
                  <input
                    type="text"
                    value={sacredForm.nameEn}
                    onChange={(e) => setSacredForm({ ...sacredForm, nameEn: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200"
                    placeholder="Sheikh Mishary Rashid Alafasy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nom Court (Pour le lecteur)
                  </label>
                  <input
                    type="text"
                    value={sacredForm.shortName}
                    onChange={(e) => setSacredForm({ ...sacredForm, shortName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200"
                    placeholder="Mishary Alafasy"
                    required
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
