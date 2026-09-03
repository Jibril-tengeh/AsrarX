import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User as UserIcon, Mail, Phone, Globe, Shield, 
  Crown, Star, Save, Trash2, Copy, Check, Lock, 
  Bell, BellOff, Wand2, ShieldAlert, Loader2, Sparkles
} from 'lucide-react';
import { UserQuickStatusPicker, UserStatusType } from './UserQuickStatusPicker';

export interface AdminUserModalUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role?: string;
  isBanned: boolean;
  isSuspended?: boolean;
  mysteryToolsDisabled: boolean;
  allToolsDisabled?: boolean;
  isTrusted: boolean;
  isPremium?: boolean;
  subscriptionTier?: string;
  country?: string;
  phone?: string;
  password?: string;
  password_hash_indicator?: string;
  pushNotificationsEnabled?: boolean;
  pushNotificationStatus?: string;
  spiritualPoints?: number;
  blockedTools?: string[];
  allowedTools?: string[];
  source?: string;
}

interface AdminUserDetailModalProps {
  isOpen: boolean;
  user: AdminUserModalUser | null;
  onClose: () => void;
  onSave: (payload: Partial<AdminUserModalUser>) => Promise<void> | void;
  onDelete: (id: string, email?: string, name?: string) => void;
  onStatusChange: (userId: string, status: UserStatusType) => Promise<void> | void;
  onToggleTrusted: (id: string) => Promise<void> | void;
  onToggleBan: (id: string) => Promise<void> | void;
  onToggleAllTools?: (id: string) => Promise<void> | void;
}

export const AdminUserDetailModal: React.FC<AdminUserDetailModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
  onDelete,
  onStatusChange,
  onToggleTrusted,
  onToggleBan,
  onToggleAllTools,
}) => {
  if (!isOpen || !user) return null;

  const [formData, setFormData] = useState<Partial<AdminUserModalUser>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        country: user.country || '',
        role: user.role || 'user',
        subscriptionTier: user.subscriptionTier || (user.isPremium ? 'premium' : 'free'),
        isPremium: user.isPremium ?? false,
        spiritualPoints: user.spiritualPoints ?? 0,
        isTrusted: user.isTrusted ?? false,
        isBanned: user.isBanned ?? false,
        mysteryToolsDisabled: user.mysteryToolsDisabled ?? false,
        allToolsDisabled: user.allToolsDisabled ?? false,
      });
    }
  }, [user]);

  const handleCopyId = () => {
    if (!user.id) return;
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const resolvedStatus: UserStatusType = user.isBanned
    ? 'banned'
    : user.isSuspended
    ? 'suspended'
    : user.isPremium || user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro'
    ? 'premium'
    : 'active';

  const avatarUrl = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || user.email || user.id)}`;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-850 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden my-6 max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-indigo-600/10 dark:from-emerald-950/40 dark:via-blue-950/40 dark:to-indigo-950/40 border-b border-gray-150 dark:border-gray-750 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={avatarUrl}
                alt={user.name || 'Avatar'}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-emerald-500 shadow-sm shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute(
                    'src',
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.id)}`
                  );
                }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white truncate">
                    {user.name || 'Membre AsrarHub'}
                  </h3>
                  {user.isTrusted && (
                    <span className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star size={10} className="fill-emerald-500 text-emerald-500" />
                      De Confiance
                    </span>
                  )}
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-750 dark:text-gray-300'
                  }`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                    ID: {user.id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 rounded-lg transition-colors cursor-pointer"
                    title="Copier l'identifiant"
                  >
                    {copiedId ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer shrink-0 ml-2"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
            {/* Quick Status Bar */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200/80 dark:border-gray-700 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Changer le statut général :
                </span>
                <UserQuickStatusPicker
                  currentStatus={resolvedStatus}
                  userId={user.id}
                  userName={user.name || user.email}
                  onStatusChange={onStatusChange}
                  size="sm"
                  layout="segmented"
                />
              </div>

              {/* Action toggles */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                <button
                  type="button"
                  onClick={() => {
                    const newTrust = !formData.isTrusted;
                    setFormData({ ...formData, isTrusted: newTrust });
                    onToggleTrusted(user.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    formData.isTrusted
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300'
                  }`}
                >
                  <Star size={13} className={formData.isTrusted ? 'fill-amber-500 text-amber-500' : ''} />
                  <span>{formData.isTrusted ? 'Statut de Confiance : Actif' : 'Donner statut de confiance'}</span>
                </button>

                {onToggleAllTools && (
                  <button
                    type="button"
                    onClick={() => {
                      const newBlocked = !formData.allToolsDisabled;
                      setFormData({ ...formData, allToolsDisabled: newBlocked });
                      onToggleAllTools(user.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      formData.allToolsDisabled
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    <ShieldAlert size={13} />
                    <span>{formData.allToolsDisabled ? 'Tous Outils Bloqués' : 'Bloquer tous les outils'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onToggleBan(user.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    user.isBanned
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/50'
                  }`}
                >
                  <Lock size={13} />
                  <span>{user.isBanned ? 'Débannir l\'utilisateur' : 'Bannir l\'utilisateur'}</span>
                </button>
              </div>
            </div>

            {/* Profile Information Inputs */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserIcon size={14} className="text-emerald-500" />
                Informations du Profil
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Nom & Prénom
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nom complet"
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@domaine.com"
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Numéro de Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+227 90 00 00 00"
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Pays de Résidence
                  </label>
                  <input
                    type="text"
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Ex: Niger, Côte d'Ivoire, Sénégal..."
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Privileges & Points */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Crown size={14} className="text-amber-500" />
                Rôle, Privilèges & Solde Spirituel
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Rôle Système
                  </label>
                  <select
                    value={formData.role || 'user'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="user">Utilisateur (Standard)</option>
                    <option value="admin">Administrateur (Complet)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Formule d'Abonnement
                  </label>
                  <select
                    value={formData.subscriptionTier || 'free'}
                    onChange={(e) => {
                      const tier = e.target.value;
                      const isPrem = tier === 'premium' || tier === 'pro';
                      setFormData({ ...formData, subscriptionTier: tier, isPremium: isPrem });
                    }}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="free">Gratuit (Standard)</option>
                    <option value="premium">Premium VIP</option>
                    <option value="pro">Professionnel (Pro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Points Spirituels
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.spiritualPoints ?? 0}
                    onChange={(e) => setFormData({ ...formData, spiritualPoints: Number(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Read-Only System Technical Details */}
            <div className="p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200/80 dark:border-gray-750 text-xs space-y-2">
              <span className="font-bold text-gray-600 dark:text-gray-300 block text-[11px] uppercase tracking-wider">
                Indicateurs Techniques & Sécurité
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2 truncate">
                  <Lock size={13} className="text-emerald-500 shrink-0" />
                  <span className="truncate">
                    Hash / Pwd : <strong className="font-mono text-gray-700 dark:text-gray-300">{user.password_hash_indicator || user.password || '•••••••• (Sécurisé)'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  {user.pushNotificationsEnabled !== false ? (
                    <Bell size={13} className="text-emerald-500 shrink-0" />
                  ) : (
                    <BellOff size={13} className="text-amber-500 shrink-0" />
                  )}
                  <span>
                    Push : <strong className={user.pushNotificationsEnabled !== false ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 font-bold'}>
                      {user.pushNotificationsEnabled !== false ? 'Activé' : 'Désactivé'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-4 bg-red-50/70 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-wider">
                  Zone Dangereuse
                </h5>
                <p className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-0.5">
                  Supprimer ce compte utilisateur de façon permanente et irréversible.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(user.id, user.email, user.name)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Trash2 size={14} />
                <span>Supprimer le compte</span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Enregistrer les modifications</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
