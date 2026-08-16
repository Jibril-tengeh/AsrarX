import React, { useState } from 'react';
import { CheckCircle2, PauseCircle, Crown, Ban, Loader2, ChevronDown } from 'lucide-react';

export type UserStatusType = 'active' | 'suspended' | 'premium' | 'banned';

export interface UserStatusInfo {
  id: UserStatusType;
  label: string;
  shortLabel: string;
  description: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  activeClass: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const USER_STATUSES: Record<UserStatusType, UserStatusInfo> = {
  active: {
    id: 'active',
    label: 'Actif (Membre Standard)',
    shortLabel: 'Actif',
    description: 'Accès normal aux outils gratuits et fonctionnels',
    colorClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    activeClass: 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50',
    icon: CheckCircle2
  },
  suspended: {
    id: 'suspended',
    label: 'Suspendu (Accès Restreint)',
    shortLabel: 'Suspendu',
    description: 'Compte temporairement gelé, accès aux outils bloqué',
    colorClass: 'text-amber-700 dark:text-amber-300',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-800',
    activeClass: 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/50',
    icon: PauseCircle
  },
  premium: {
    id: 'premium',
    label: 'Premium (Abonné VIP)',
    shortLabel: 'Premium',
    description: 'Accès illimité aux secrets, carrés magiques et outils avancés',
    colorClass: 'text-purple-700 dark:text-purple-300',
    bgClass: 'bg-purple-50 dark:bg-purple-950/40',
    borderClass: 'border-purple-200 dark:border-purple-800',
    activeClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm ring-2 ring-purple-400/50',
    icon: Crown
  },
  banned: {
    id: 'banned',
    label: 'Banni (Exclu Définitivement)',
    shortLabel: 'Banni',
    description: 'Compte bloqué avec écran d\'interdiction et déconnexion',
    colorClass: 'text-red-700 dark:text-red-300',
    bgClass: 'bg-red-50 dark:bg-red-950/40',
    borderClass: 'border-red-200 dark:border-red-800',
    activeClass: 'bg-red-600 text-white shadow-sm ring-2 ring-red-400/50',
    icon: Ban
  }
};

export const getResolvedUserStatus = (user: {
  isBanned?: boolean;
  isSuspended?: boolean;
  isPremium?: boolean;
  subscriptionTier?: string;
  mysteryToolsDisabled?: boolean;
  allToolsDisabled?: boolean;
}): UserStatusType => {
  if (user.isBanned) return 'banned';
  if (user.isSuspended || (user.mysteryToolsDisabled && user.allToolsDisabled)) return 'suspended';
  if (user.isPremium || user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro') return 'premium';
  return 'active';
};

interface UserQuickStatusPickerProps {
  currentStatus: UserStatusType;
  userId: string;
  userName?: string;
  onStatusChange: (userId: string, newStatus: UserStatusType) => Promise<void> | void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'segmented' | 'dropdown' | 'expanded';
}

export const UserQuickStatusPicker: React.FC<UserQuickStatusPickerProps> = ({
  currentStatus,
  userId,
  userName,
  onStatusChange,
  disabled = false,
  size = 'sm',
  layout = 'segmented'
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const handleSelect = async (status: UserStatusType) => {
    if (status === currentStatus || disabled || isUpdating) return;
    setIsUpdating(true);
    setIsOpenDropdown(false);
    try {
      await onStatusChange(userId, status);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentInfo = USER_STATUSES[currentStatus] || USER_STATUSES.active;
  const CurrentIcon = currentInfo.icon;

  if (layout === 'expanded') {
    return (
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Statut & Privilèges du Compte
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {(Object.keys(USER_STATUSES) as UserStatusType[]).map((st) => {
            const info = USER_STATUSES[st];
            const Icon = info.icon;
            const isCurrent = currentStatus === st;
            return (
              <button
                key={st}
                type="button"
                disabled={disabled || isUpdating}
                onClick={() => handleSelect(st)}
                className={`flex flex-col text-left p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isCurrent
                    ? `${info.bgClass} ${info.borderClass} ring-2 ring-offset-1 dark:ring-offset-gray-800 ${info.colorClass}`
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                } ${disabled || isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Icon size={16} />
                    <span>{info.shortLabel}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-white dark:bg-gray-900 border border-current shadow-2xs">
                      Actif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-tight">
                  {info.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (layout === 'dropdown') {
    return (
      <div className="relative inline-block text-left">
        <button
          type="button"
          disabled={disabled || isUpdating}
          onClick={() => setIsOpenDropdown(!isOpenDropdown)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${currentInfo.bgClass} ${currentInfo.borderClass} ${currentInfo.colorClass}`}
        >
          {isUpdating ? <Loader2 size={13} className="animate-spin" /> : <CurrentIcon size={13} />}
          <span>{currentInfo.shortLabel}</span>
          <ChevronDown size={12} className={`transition-transform ${isOpenDropdown ? 'rotate-180' : ''}`} />
        </button>

        {isOpenDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpenDropdown(false)} />
            <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-700 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Changer le statut
              </div>
              {(Object.keys(USER_STATUSES) as UserStatusType[]).map((st) => {
                const info = USER_STATUSES[st];
                const Icon = info.icon;
                const isCurrent = currentStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleSelect(st)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                      isCurrent
                        ? `${info.bgClass} ${info.colorClass}`
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={info.colorClass} />
                      <span>{info.label}</span>
                    </div>
                    {isCurrent && <span className="text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // Segmented Pill selector (Default)
  const isSm = size === 'sm';
  return (
    <div
      className={`inline-flex items-center p-1 bg-gray-100/90 dark:bg-gray-850 border border-gray-200/90 dark:border-gray-700 rounded-xl shadow-2xs ${
        disabled || isUpdating ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      role="group"
      aria-label={`Statut de l'utilisateur ${userName || userId}`}
    >
      {(Object.keys(USER_STATUSES) as UserStatusType[]).map((st) => {
        const info = USER_STATUSES[st];
        const Icon = info.icon;
        const isCurrent = currentStatus === st;

        return (
          <button
            key={st}
            type="button"
            disabled={disabled || isUpdating}
            onClick={() => handleSelect(st)}
            title={`${info.label} - ${info.description}`}
            className={`flex items-center gap-1 font-bold rounded-lg transition-all cursor-pointer select-none ${
              isSm ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
            } ${
              isCurrent
                ? info.activeClass
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/60'
            }`}
          >
            {isCurrent && isUpdating ? (
              <Loader2 size={isSm ? 11 : 13} className="animate-spin" />
            ) : (
              <Icon size={isSm ? 12 : 14} />
            )}
            <span>{info.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
};
