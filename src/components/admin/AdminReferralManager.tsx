import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Clock, 
  Users, 
  Sparkles, 
  Save, 
  Check, 
  AlertCircle, 
  Play, 
  Eye, 
  Search, 
  RefreshCw, 
  Crown, 
  Award, 
  Share2, 
  ExternalLink,
  Sliders,
  Video,
  Languages,
  CheckCircle2,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getReferralConfig, 
  saveReferralConfig, 
  getAllReferralsAdmin, 
  ReferralConfig, 
  ReferralRecord, 
  DEFAULT_REFERRAL_CONFIG 
} from '../../services/referralService';
import { ReferralWelcomeModal } from '../ReferralWelcomeModal';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const HOUR_PRESETS = [1, 2, 4, 6, 8, 12];

export const AdminReferralManager: React.FC = () => {
  const [config, setConfig] = useState<ReferralConfig>(DEFAULT_REFERRAL_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Referrals List State
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'history' | 'preview'>('settings');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLang, setPreviewLang] = useState<'fr' | 'en' | 'ha'>('fr');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [loadedConfig, loadedReferrals] = await Promise.all([
        getReferralConfig(),
        getAllReferralsAdmin()
      ]);
      setConfig(loadedConfig);
      setReferrals(loadedReferrals);
    } catch (e: any) {
      setErrorMessage(e?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    setErrorMessage('');
    try {
      await saveReferralConfig(config);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e: any) {
      setErrorMessage(e?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet enregistrement d'historique ?")) return;
    try {
      await deleteDoc(doc(db, 'referrals', id));
      setReferrals(prev => prev.filter(r => r.id !== id));
    } catch (e: any) {
      alert("Erreur lors de la suppression: " + e?.message);
    }
  };

  const filteredReferrals = referrals.filter(r => 
    r.referrerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.referrerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.referredName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.referredEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.referralCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalReferrals = referrals.length;
  const totalHoursDistributed = referrals.reduce((acc, curr) => acc + (curr.rewardHours || 0) + (curr.refereeRewardHours || 0), 0);

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden min-w-0">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-lg relative overflow-hidden w-full max-w-full">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
              <Gift size={28} className="text-amber-300 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight break-words">
                  Gestion du Système de Parrainage
                </h1>
                <span className={`text-[10px] sm:text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full shrink-0 ${
                  config.enabled ? 'bg-emerald-400 text-gray-950' : 'bg-red-500 text-white'
                }`}>
                  {config.enabled ? 'Système Actif' : 'Système Inactif'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl break-words">
                Configurez les heures de récompense Premium accordées aux parrains et filleuls, personnalisez les animations vidéo et suivez toutes les invitations en temps réel.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center bg-black/20 rounded-xl p-1 border border-white/10">
              {(['fr', 'en', 'ha'] as const).map((l) => (
                <button
                  key={`prev-lang-${l}`}
                  onClick={() => {
                    setPreviewLang(l);
                    setPreviewOpen(true);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                    previewLang === l && previewOpen
                      ? 'bg-amber-400 text-gray-950 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Tester la modal en ${l === 'fr' ? 'Français' : l === 'ha' ? 'Haoussa' : 'Anglais'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-white/20 backdrop-blur-md cursor-pointer text-center"
            >
              <Eye size={16} />
              <span>Tester Modal ({previewLang.toUpperCase()})</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 bg-white text-gray-950 hover:bg-amber-100 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 text-center"
            >
              {saving ? <RefreshCw size={16} className="animate-spin text-emerald-600" /> : savedSuccess ? <Check size={16} className="text-emerald-600" /> : <Save size={16} />}
              <span>{saving ? 'Enregistrement...' : savedSuccess ? 'Enregistré !' : 'Enregistrer'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white truncate">{totalReferrals}</div>
            <div className="text-[11px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider truncate">Parrainages Réussis</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 truncate">+{totalHoursDistributed}h</div>
            <div className="text-[11px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider truncate">Heures Distribuées</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400 truncate">{config.rewardHours}h / invité</div>
            <div className="text-[11px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider truncate">Gain Actuel Parrain</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 gap-2 sm:gap-4 overflow-x-auto pb-1 max-w-full">
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-1 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'settings'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <Sliders size={16} />
          <span>Configuration & Heures</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-1 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'history'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <TrendingUp size={16} />
          <span>Historique ({referrals.length})</span>
        </button>
      </div>

      {/* Tab 1: Settings */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* System Master Switch */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">Activer le Système de Parrainage</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Permet aux utilisateurs de parrainer et de gagner du Premium gratuit.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6.5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            {/* Configurable Hours for Referrer (Parrain) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={18} className="text-amber-500" />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Durée Premium Offerte au Parrain (Par utilisateur invité)
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Choisissez le nombre d'heures Premium ajoutées au compte du parrain à chaque nouvelle inscription valide :
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {HOUR_PRESETS.map((h, hIdx) => (
                  <button
                    key={`ref-hours-${h}-${hIdx}`}
                    type="button"
                    onClick={() => setConfig({ ...config, rewardHours: h })}
                    className={`py-3 rounded-xl font-black text-sm flex flex-col items-center justify-center transition-all cursor-pointer border ${
                      config.rewardHours === h
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                        : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-amber-400'
                    }`}
                  >
                    <span>{h} Heures</span>
                    <span className="text-[10px] font-normal opacity-80">{h >= 12 ? 'Recommandé' : 'Standard'}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Ou valeur personnalisée :</span>
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={config.rewardHours}
                  onChange={(e) => setConfig({ ...config, rewardHours: Math.max(1, Number(e.target.value) || 1) })}
                  className="w-24 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-center font-bold text-sm text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500">heures</span>
              </div>
            </div>

            {/* Configurable Hours for Referee (Filleul) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Gift size={18} className="text-emerald-500" />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Durée Premium Offerte au Filleul (Nouvel Inscrit)
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Heures d'accès Premium accordées au nouvel utilisateur dès son inscription avec un code :
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {HOUR_PRESETS.map((h, hIdx) => (
                  <button
                    key={`referee-hours-${h}-${hIdx}`}
                    type="button"
                    onClick={() => setConfig({ ...config, refereeRewardHours: h })}
                    className={`py-3 rounded-xl font-black text-sm flex flex-col items-center justify-center transition-all cursor-pointer border ${
                      config.refereeRewardHours === h
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105'
                        : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-400'
                    }`}
                  >
                    <span>{h} Heures</span>
                    <span className="text-[10px] font-normal opacity-80">Bonus</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Points Spirituels */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-xs">
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                Points Spirituels par Parrainage
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Points crédités au parrain pour monter de niveau dans l'application :
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="1000"
                  step="10"
                  value={config.spiritualPointsPerReferral}
                  onChange={(e) => setConfig({ ...config, spiritualPointsPerReferral: Number(e.target.value) || 50 })}
                  className="w-32 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-sm text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 font-semibold">points / ami inscrit</span>
              </div>
            </div>

            {/* Custom Referral Link / Play Store URL Configuration */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Share2 size={18} className="text-teal-500" />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Lien de Partage & Redirection (Play Store / Domaine Web)
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                Par défaut, l'application génère les liens avec l'adresse web actuelle (URL courante). Lorsque vous publiez votre application sur le <strong>Google Play Store</strong> ou sur votre <strong>nom de domaine personnalisé</strong> (ex: <code>https://asrarhub.com</code>), vous pouvez définir ici l'adresse racine :
              </p>

              <div className="space-y-2">
                <input
                  type="url"
                  value={config.customShareBaseUrl || ''}
                  onChange={(e) => setConfig({ ...config, customShareBaseUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white placeholder:text-gray-400"
                  placeholder="Ex: https://asrarhub.com ou https://play.google.com/store/apps/details?id=com.asrarhub.app"
                />
                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                  <ExternalLink size={12} className="text-teal-500 shrink-0" />
                  <span>
                    Si laissé vide, l'URL du navigateur (ex: <code>{typeof window !== 'undefined' ? window.location.origin : 'https://...'}</code>) est utilisée automatiquement.
                  </span>
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Video & Welcome Message Customizer */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Video / Animation Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Video size={18} className="text-amber-500" />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Vidéo & Animation de Bienvenue
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                URL de la vidéo d'arrière-plan animée (MP4) diffusée sur la fenêtre modale de célébration :
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    URL du fichier Vidéo MP4 :
                  </label>
                  <input
                    type="url"
                    value={config.customVideoUrl || ''}
                    onChange={(e) => setConfig({ ...config, customVideoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white"
                    placeholder="https://.../video.mp4"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:brightness-105"
                  >
                    <Play size={14} />
                    <span>Tester le Rendu en Direct</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Multilingual Messages */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-xs space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Languages size={18} className="text-teal-500" />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Messages Dynamiques de Bienvenue
                </h3>
              </div>

              {/* French */}
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Message Français (FR) :
                </label>
                <textarea
                  rows={3}
                  value={config.welcomeMessageFr || ''}
                  onChange={(e) => setConfig({ ...config, welcomeMessageFr: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                />
              </div>

              {/* English */}
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Message Anglais (EN) :
                </label>
                <textarea
                  rows={2}
                  value={config.welcomeMessageEn || ''}
                  onChange={(e) => setConfig({ ...config, welcomeMessageEn: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                />
              </div>

              {/* Hausa */}
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Message Haoussa (HA) :
                </label>
                <textarea
                  rows={2}
                  value={config.welcomeMessageHa || ''}
                  onChange={(e) => setConfig({ ...config, welcomeMessageHa: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                />
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Referral History & Table */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs overflow-hidden">
          
          {/* Table Header & Search */}
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Historique Complet des Parrainages</h3>
              <p className="text-xs text-gray-500">Liste des utilisateurs ayant invité ou rejoint via un code parrain.</p>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher parrain, filleul, code..."
                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white w-full sm:w-64"
              />
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="p-3.5">Parrain (Inviteur)</th>
                  <th className="p-3.5">Filleul (Invité)</th>
                  <th className="p-3.5">Code Utilisé</th>
                  <th className="p-3.5">Heures Créditées</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
                {filteredReferrals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      Aucun parrainage enregistré pour le moment.
                    </td>
                  </tr>
                ) : (
                  filteredReferrals.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750/50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-gray-900 dark:text-white">{r.referrerName || 'Anonyme'}</div>
                        <div className="text-[11px] text-gray-400">{r.referrerEmail}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">{r.referredName || 'Utilisateur'}</div>
                        <div className="text-[11px] text-gray-400">{r.referredEmail}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-bold">
                          {r.referralCode}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                            +{r.rewardHours || config.rewardHours}h Parrain
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                            +{r.refereeRewardHours || config.refereeRewardHours}h Filleul
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-gray-500 whitespace-nowrap">
                        {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'Récent'}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteRecord(r.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Supprimer la trace"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Live Preview Modal */}
      <ReferralWelcomeModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        referrerName={
          previewLang === 'fr' 
            ? "Cheikh Ahmadou (Exemple)" 
            : previewLang === 'ha' 
            ? "Cheikh Ahmadou (Misali)" 
            : "Cheikh Ahmadou (Example)"
        }
        hoursAwarded={config.refereeRewardHours || 1}
        welcomeTitle={
          previewLang === 'ha'
            ? config.welcomeTitleHa
            : previewLang === 'en'
            ? config.welcomeTitleEn
            : config.welcomeTitleFr
        }
        welcomeMessage={
          previewLang === 'ha'
            ? config.welcomeMessageHa
            : previewLang === 'en'
            ? config.welcomeMessageEn
            : config.welcomeMessageFr
        }
        customVideoUrl={config.customVideoUrl}
        lang={previewLang}
      />

    </div>
  );
};
