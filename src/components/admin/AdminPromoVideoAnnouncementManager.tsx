import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Film, 
  Sparkles, 
  Eye, 
  Save, 
  Check, 
  Crown, 
  Clock, 
  Tag, 
  ToggleLeft, 
  ToggleRight, 
  Globe, 
  Layers, 
  Gift, 
  AlertCircle, 
  RefreshCw,
  Play,
  Flame,
  CheckCircle2,
  Plus,
  Trash2,
  Send
} from 'lucide-react';
import { PromoAnnouncement, DEFAULT_PROMO_ANNOUNCEMENT } from '../../types/promoAnnouncement';
import { promoAnnouncementService } from '../../services/promoAnnouncementService';
import { VIDEO_CARD_PRESETS, getPresetById, VideoCardThemeId } from '../../types/updateCards';
import { PromoVideoCard } from '../videoCards/PromoVideoCard';
import { PromoVideoModal } from '../videoCards/PromoVideoModal';

interface AdminPromoVideoAnnouncementManagerProps {
  promoCodes?: Array<{
    code: string;
    description?: string;
    type?: string;
    durationHours?: number;
    discountPercent?: number;
  }>;
}

export const AdminPromoVideoAnnouncementManager: React.FC<AdminPromoVideoAnnouncementManagerProps> = ({
  promoCodes = []
}) => {
  const [announcement, setAnnouncement] = useState<PromoAnnouncement>(DEFAULT_PROMO_ANNOUNCEMENT);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeLangTab, setActiveLangTab] = useState<'fr' | 'en' | 'ha'>('fr');
  const [showLivePreviewModal, setShowLivePreviewModal] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  // Load from service
  useEffect(() => {
    const unsub = promoAnnouncementService.subscribeActiveAnnouncement((data) => {
      if (data) {
        setAnnouncement(data);
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const showNotification = (msg: string, isError = false) => {
    setFeedback({ message: msg, isError });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSave = async () => {
    if (!announcement.promoCode.trim()) {
      showNotification('Veuillez spécifier le code promo à diffuser.', true);
      return;
    }

    try {
      setIsSaving(true);
      await promoAnnouncementService.saveAnnouncement(announcement);
      showNotification('✅ Annonce vidéo de code promo enregistrée et synchronisée avec succès !');
    } catch (err: any) {
      showNotification(`Erreur lors de l'enregistrement : ${err.message || 'Échec'}`, true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    const newState = !announcement.isActive;
    setAnnouncement(prev => ({ ...prev, isActive: newState }));
    try {
      await promoAnnouncementService.toggleActive(newState);
      showNotification(
        newState 
          ? '🟢 Annonce vidéo de code promo PUBLIÉE et active pour les utilisateurs !' 
          : '🔴 Annonce vidéo mise en pause (désactivée pour les utilisateurs).'
      );
    } catch (err: any) {
      showNotification(err.message || 'Erreur de bascule', true);
    }
  };

  const handleAddPerk = () => {
    const key = activeLangTab === 'fr' ? 'perksFr' : activeLangTab === 'en' ? 'perksEn' : 'perksHa';
    const currentList = announcement[key] || [];
    setAnnouncement({
      ...announcement,
      [key]: [...currentList, '']
    });
  };

  const handleUpdatePerk = (index: number, val: string) => {
    const key = activeLangTab === 'fr' ? 'perksFr' : activeLangTab === 'en' ? 'perksEn' : 'perksHa';
    const currentList = [...(announcement[key] || [])];
    currentList[index] = val;
    setAnnouncement({
      ...announcement,
      [key]: currentList
    });
  };

  const handleRemovePerk = (index: number) => {
    const key = activeLangTab === 'fr' ? 'perksFr' : activeLangTab === 'en' ? 'perksEn' : 'perksHa';
    const currentList = (announcement[key] || []).filter((_, i) => i !== index);
    setAnnouncement({
      ...announcement,
      [key]: currentList
    });
  };

  const selectedPreset = getPresetById(announcement.videoCardTheme);

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border shadow-lg animate-fadeIn ${
          feedback.isError 
            ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700' 
            : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
        }`}>
          {feedback.isError ? <AlertCircle className="shrink-0 text-rose-500" /> : <Check className="shrink-0 text-emerald-500 font-black" />}
          <p className="text-sm font-bold">{feedback.message}</p>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl space-y-6">
        
        {/* Top Header & Status Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Film size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Annonce Vidéo Professionnelle de Code Promo</span>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold px-2.5 py-0.5 rounded-full border border-purple-300 dark:border-purple-700">
                    Live Broadcast
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Diffusez un code promo avec une carte animée et vidéo haute définition pour maximiser les conversions.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Controls (Live Toggle & Preview) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Toggle */}
            <button
              type="button"
              onClick={handleToggleActive}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all border shadow-sm cursor-pointer ${
                announcement.isActive
                  ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20'
                  : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700'
              }`}
            >
              {announcement.isActive ? (
                <>
                  <ToggleRight size={20} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Statut : PUBLIÉ (En direct)</span>
                </>
              ) : (
                <>
                  <ToggleLeft size={20} className="text-rose-500" />
                  <span>Statut : DÉSACTIVÉ (Brouillon)</span>
                </>
              )}
            </button>

            {/* Preview Modal Button */}
            <button
              type="button"
              onClick={() => setShowLivePreviewModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <Eye size={16} />
              <span>Tester la Vidéo en Direct</span>
            </button>
          </div>
        </div>

        {/* 2-Column Workspace: Left Form, Right Live Sticky Preview */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* LEFT: Configuration Form (7 cols) */}
          <div className="xl:col-span-7 space-y-6">
            
            {/* 1. Associated Promo Code & Benefit */}
            <div className="bg-gray-50 dark:bg-gray-750/70 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Tag size={15} className="text-amber-500" />
                  1. Code Promo & Réduction
                </span>
                {promoCodes.length > 0 && (
                  <span className="text-[11px] text-gray-400 font-medium">
                    {promoCodes.length} code{promoCodes.length > 1 ? 's' : ''} disponible{promoCodes.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    Code Promo à Diffuser *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={announcement.promoCode}
                      onChange={(e) => setAnnouncement({ ...announcement, promoCode: e.target.value.toUpperCase() })}
                      placeholder="ex: VIP2H, ASRAR50"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono font-black text-sm uppercase tracking-wider focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Quick Select from existing codes */}
                {promoCodes.length > 0 && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Choisir parmi les codes existants :
                    </label>
                    <select
                      onChange={(e) => {
                        const sel = promoCodes.find(p => p.code === e.target.value);
                        if (sel) {
                          setAnnouncement(prev => ({
                            ...prev,
                            promoCode: sel.code,
                            benefitFr: sel.durationHours ? `⚡ ${sel.durationHours} Heures VIP Offertes` : (sel.discountPercent ? `-${sel.discountPercent}% de Réduction` : prev.benefitFr)
                          }));
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold"
                    >
                      <option value="">-- Sélectionner un code --</option>
                      {promoCodes.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.code} ({p.durationHours ? `${p.durationHours}h VIP` : (p.discountPercent ? `-${p.discountPercent}%` : p.type)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Video Theme Selector (10 Themes) */}
            <div className="bg-gray-50 dark:bg-gray-750/70 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Film size={15} className="text-purple-500" />
                  2. Thème Visuel & Fond Vidéo (10 Thèmes Premium)
                </span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  {selectedPreset.titleFr}
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Chaque thème possède sa boucle vidéo HD dédiée, son système de particules dorées/cosmiques et sa palette de lumières.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {VIDEO_CARD_PRESETS.map((p) => {
                  const isSelected = announcement.videoCardTheme === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setAnnouncement({ ...announcement, videoCardTheme: p.id })}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 relative overflow-hidden cursor-pointer ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 ring-2 ring-purple-500/30'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-mono font-bold text-gray-400">#{p.index}</span>
                        {isSelected && <Check size={12} className="text-purple-600 dark:text-purple-400 font-bold" />}
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate w-full">
                        {p.titleFr.split(' ')[0]} {p.titleFr.split(' ')[1] || ''}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-full">
                        {p.badgeFr}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Multilingual Text & Perks Tabs (FR, EN, HA) */}
            <div className="bg-gray-50 dark:bg-gray-750/70 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Globe size={15} className="text-indigo-500" />
                  3. Textes & Avantages Multilingues
                </span>

                {/* Lang Switcher Tabs */}
                <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-xl">
                  {(['fr', 'en', 'ha'] as const).map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLangTab(lang)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeLangTab === lang
                          ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                      }`}
                    >
                      {lang === 'fr' ? '🇫🇷 Français' : lang === 'en' ? '🇬🇧 English' : '🇳🇬 Hausa'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form fields for currently selected language */}
              {activeLangTab === 'fr' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Badge de l'Annonce (FR) :
                    </label>
                    <input
                      type="text"
                      value={announcement.badgeFr}
                      onChange={(e) => setAnnouncement({ ...announcement, badgeFr: e.target.value })}
                      placeholder="ex: 👑 OFFRE FLASH VIP"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Titre Principal (FR) :
                    </label>
                    <input
                      type="text"
                      value={announcement.titleFr}
                      onChange={(e) => setAnnouncement({ ...announcement, titleFr: e.target.value })}
                      placeholder="ex: Offre Spéciale Asrar VIP Débloquée !"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Étiquette du Bénéfice (FR) :
                    </label>
                    <input
                      type="text"
                      value={announcement.benefitFr}
                      onChange={(e) => setAnnouncement({ ...announcement, benefitFr: e.target.value })}
                      placeholder="ex: ⚡ 2 Heures VIP Offertes Immédiatement"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Description Détaillée (FR) :
                    </label>
                    <textarea
                      rows={2}
                      value={announcement.descriptionFr}
                      onChange={(e) => setAnnouncement({ ...announcement, descriptionFr: e.target.value })}
                      placeholder="Description des avantages du code promo..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Texte du Bouton d'Action (FR) :
                    </label>
                    <input
                      type="text"
                      value={announcement.ctaTextFr}
                      onChange={(e) => setAnnouncement({ ...announcement, ctaTextFr: e.target.value })}
                      placeholder="ex: Copier & Débloquer VIP"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold"
                    />
                  </div>
                </div>
              )}

              {activeLangTab === 'en' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Badge (EN) :
                    </label>
                    <input
                      type="text"
                      value={announcement.badgeEn}
                      onChange={(e) => setAnnouncement({ ...announcement, badgeEn: e.target.value })}
                      placeholder="e.g. 👑 VIP FLASH PROMO"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Title (EN) :
                    </label>
                    <input
                      type="text"
                      value={announcement.titleEn}
                      onChange={(e) => setAnnouncement({ ...announcement, titleEn: e.target.value })}
                      placeholder="e.g. Special Asrar VIP Offer Unlocked!"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Benefit Label (EN) :
                    </label>
                    <input
                      type="text"
                      value={announcement.benefitEn}
                      onChange={(e) => setAnnouncement({ ...announcement, benefitEn: e.target.value })}
                      placeholder="e.g. ⚡ 2 Hours Free VIP Access"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Description (EN) :
                    </label>
                    <textarea
                      rows={2}
                      value={announcement.descriptionEn}
                      onChange={(e) => setAnnouncement({ ...announcement, descriptionEn: e.target.value })}
                      placeholder="Description of the benefits in English..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      CTA Button Text (EN) :
                    </label>
                    <input
                      type="text"
                      value={announcement.ctaTextEn}
                      onChange={(e) => setAnnouncement({ ...announcement, ctaTextEn: e.target.value })}
                      placeholder="e.g. Copy Code & Unlock VIP"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold"
                    />
                  </div>
                </div>
              )}

              {activeLangTab === 'ha' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Badge (HA) :
                    </label>
                    <input
                      type="text"
                      value={announcement.badgeHa}
                      onChange={(e) => setAnnouncement({ ...announcement, badgeHa: e.target.value })}
                      placeholder="misali: 👑 BABBAN RANGWAME"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Taken Sanarwa (HA) :
                    </label>
                    <input
                      type="text"
                      value={announcement.titleHa}
                      onChange={(e) => setAnnouncement({ ...announcement, titleHa: e.target.value })}
                      placeholder="misali: Babban Rangwamen Asrar VIP!"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Fa'ida (HA) :
                    </label>
                    <input
                      type="text"
                      value={announcement.benefitHa}
                      onChange={(e) => setAnnouncement({ ...announcement, benefitHa: e.target.value })}
                      placeholder="misali: ⚡ Awanni 2 Na Kyauta a VIP"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Bayanin Rangwame (HA) :
                    </label>
                    <textarea
                      rows={2}
                      value={announcement.descriptionHa}
                      onChange={(e) => setAnnouncement({ ...announcement, descriptionHa: e.target.value })}
                      placeholder="Bayanin sirri da alfanun lambar..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      Rubutun Maballi (HA) :
                    </label>
                    <input
                      type="text"
                      value={announcement.ctaTextHa}
                      onChange={(e) => setAnnouncement({ ...announcement, ctaTextHa: e.target.value })}
                      placeholder="misali: Kwafi Lambar & Bude VIP"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Bullet perks manager */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Points Clés & Avantages ({activeLangTab.toUpperCase()}) :
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPerk}
                    className="text-xs text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Ajouter un point</span>
                  </button>
                </div>

                {((activeLangTab === 'fr' ? announcement.perksFr : activeLangTab === 'en' ? announcement.perksEn : announcement.perksHa) || []).map((perk, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={perk}
                      onChange={(e) => handleUpdatePerk(idx, e.target.value)}
                      placeholder={`Avantage #${idx + 1}...`}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePerk(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Display Settings & Countdown */}
            <div className="bg-gray-50 dark:bg-gray-750/70 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Clock size={15} className="text-blue-500" />
                4. Options d'Affichage & Compte à Rebours
              </span>

              <div className="space-y-3">
                {/* Popup modal toggle */}
                <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      Afficher en Popup Vidéo Interactive
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Ouvre automatiquement la carte vidéo animée lors de la visite d'un utilisateur.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={announcement.showAsModal}
                    onChange={(e) => setAnnouncement({ ...announcement, showAsModal: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                </label>

                {/* Banner toggle */}
                <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      Afficher en Bannière Supérieure
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Bannière élégante sur l'accueil, la boutique et la page de paiement.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={announcement.showInBanner}
                    onChange={(e) => setAnnouncement({ ...announcement, showInBanner: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                </label>

                {/* Expiration date toggle */}
                <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2">
                  <label className="flex items-center justify-between gap-3 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white block">
                        Activer une Date Limite (Compte à Rebours)
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        Affiche un compte à rebours dynamique créant un sentiment d'urgence.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={announcement.hasExpiry}
                      onChange={(e) => setAnnouncement({ ...announcement, hasExpiry: e.target.checked })}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                  </label>

                  {announcement.hasExpiry && (
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                      <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400 block mb-1">
                        Date et heure d'expiration :
                      </label>
                      <input
                        type="datetime-local"
                        value={announcement.expiryDate || ''}
                        onChange={(e) => setAnnouncement({ ...announcement, expiryDate: e.target.value })}
                        className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-750 text-gray-900 dark:text-white text-xs font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-purple-500/25 active:scale-95 transition-all cursor-pointer"
              >
                {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Enregistrer & Diffuser l'Annonce Vidéo</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Live Visual Preview (5 cols) */}
          <div className="xl:col-span-5 space-y-3">
            <div className="sticky top-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" />
                  Aperçu de la Carte Vidéo
                </span>
                <span className="text-[11px] font-mono text-purple-500 font-bold">
                  {selectedPreset.id}
                </span>
              </div>

              {/* Rendered Live Card Component */}
              <div className="w-full">
                <PromoVideoCard
                  announcement={announcement}
                  showCloseButton={false}
                />
              </div>

              <p className="text-center text-[11px] text-gray-500 dark:text-gray-400 italic">
                * Cet aperçu interactif reflète exactement le rendu visuel avec vidéo, particules et bouton de copie pour les utilisateurs.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Live Preview Modal */}
      {showLivePreviewModal && (
        <PromoVideoModal
          forcedAnnouncement={announcement}
          isOpen={showLivePreviewModal}
          onClose={() => setShowLivePreviewModal(false)}
          isPreview={true}
        />
      )}
    </div>
  );
};
