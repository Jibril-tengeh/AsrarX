import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, User, Eye, Ban, CheckCircle2, 
  Trash2, Bell, Crown, PauseCircle, Clock, Search, Filter, RefreshCw, 
  ExternalLink, ChevronRight, ToggleLeft, ToggleRight, X, Sparkles
} from 'lucide-react';
import { 
  SecurityAlert, 
  dismissSecurityAlert, 
  clearAllSecurityAlerts, 
  markAllSecurityAlertsAsRead 
} from '../../utils/securityAlerts';
import { UserQuickStatusPicker, UserStatusType, getResolvedUserStatus } from './UserQuickStatusPicker';

interface AdminSecurityAlertsManagerProps {
  alerts: SecurityAlert[];
  isTrackingEnabled: boolean;
  onToggleTracking: (enabled: boolean) => void;
  onOpenUserDetail?: (user: any) => void;
  onSetUserStatus: (userId: string, newStatus: UserStatusType) => Promise<void> | void;
  users?: any[];
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminSecurityAlertsManager: React.FC<AdminSecurityAlertsManagerProps> = ({
  alerts,
  isTrackingEnabled,
  onToggleTracking,
  onOpenUserDetail,
  onSetUserStatus,
  users = [],
  showToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'medium' | 'low'>('all');
  const [isClearing, setIsClearing] = useState(false);

  const activeAlerts = alerts.filter(a => a.status !== 'dismissed');

  const filteredAlerts = activeAlerts.filter(alert => {
    const matchesSearch = 
      !searchTerm ||
      alert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.toolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.toolId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.userId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = 
      severityFilter === 'all' || alert.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const criticalCount = activeAlerts.filter(a => a.attemptCount >= 3 || a.severity === 'critical').length;
  const uniqueUsersCount = new Set(activeAlerts.map(a => a.userId)).size;

  const handleClearAll = async () => {
    if (!window.confirm('Voulez-vous vraiment effacer tous les avertissements de sécurité ?')) return;
    setIsClearing(true);
    try {
      await clearAllSecurityAlerts();
      showToast('Toutes les alertes de sécurité ont été effacées.');
    } catch (e) {
      showToast('Erreur lors de la suppression des alertes.', 'error');
    } finally {
      setIsClearing(false);
    }
  };

  const handleDismiss = async (alertId: string) => {
    try {
      await dismissSecurityAlert(alertId);
      showToast('Alerte ignorée.');
    } catch (e) {
      showToast('Erreur lors du traitement.', 'error');
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "À l'instant";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays} j`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-gradient-to-br from-red-950/20 via-white to-amber-950/10 dark:from-red-950/40 dark:via-gray-800 dark:to-gray-850 rounded-3xl p-6 shadow-sm border border-red-200/60 dark:border-red-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-red-100 dark:border-red-900/30">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-600/10 dark:bg-red-500/20 border border-red-300 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 shadow-sm">
              <ShieldAlert size={26} className={criticalCount > 0 ? 'animate-bounce' : ''} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight">
                  Centre de Vigilance & Alertes d'Accès Restreints
                </h3>
                {criticalCount > 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white animate-pulse shadow-sm">
                    {criticalCount} CRITIQUE{criticalCount > 1 ? 'S' : ''}
                  </span>
                ) : activeAlerts.length > 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    {activeAlerts.length} avertissement{activeAlerts.length > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center gap-1">
                    <ShieldCheck size={13} /> Système Sécurisé
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Détection en direct des utilisateurs tentant d'accéder aux secrets réservés, outils bloqués ou fonctionnalités en maintenance.
              </p>
            </div>
          </div>

          {/* Toggle Activation / Désactivation Feature */}
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2.5 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs shrink-0">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                Surveillance Active
              </p>
              <p className="text-[10px] text-gray-500">
                {isTrackingEnabled ? 'Alertes activées' : 'Alertes désactivées'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToggleTracking(!isTrackingEnabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                isTrackingEnabled ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              title={isTrackingEnabled ? 'Désactiver la détection des accès restreints' : 'Activer la détection des accès restreints'}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isTrackingEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-gray-150 dark:border-gray-700">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Tentatives</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
              {activeAlerts.reduce((sum, a) => sum + (a.attemptCount || 1), 0)}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-red-200/70 dark:border-red-900/40">
            <p className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Accès Répétés (≥3)</p>
            <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-0.5">
              {criticalCount}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-gray-150 dark:border-gray-700">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Comptes Impliqués</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
              {uniqueUsersCount}
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xs p-3.5 rounded-2xl border border-gray-150 dark:border-gray-700">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Statut Module</p>
            <p className={`text-xs font-bold mt-2 ${isTrackingEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
              {isTrackingEnabled ? '● Opérationnel' : '○ En Veille'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par utilisateur, email, outil ou ID..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-750 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSeverityFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  severityFilter === 'all'
                    ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                Tous ({activeAlerts.length})
              </button>
              <button
                onClick={() => setSeverityFilter('critical')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  severityFilter === 'critical'
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
                }`}
              >
                Critiques ({criticalCount})
              </button>
            </div>

            {activeAlerts.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={isClearing}
                className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-gray-750 dark:hover:bg-red-950/40 dark:text-gray-300 dark:hover:text-red-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Effacer tout l'historique des alertes"
              >
                <Trash2 size={13} />
                <span>Effacer tout</span>
              </button>
            )}
          </div>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <ShieldCheck className="mx-auto mb-2 text-emerald-500" size={36} />
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Aucune tentative d'accès non autorisée détectée
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {searchTerm || severityFilter !== 'all'
                ? 'Aucune alerte ne correspond à vos filtres actuels.'
                : 'Tous les accès aux outils spirituels sont réguliers et conformes aux autorisations.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const matchingUser = users.find(u => u.id === alert.userId || u.email === alert.userEmail);
              const resolvedStatus = matchingUser ? getResolvedUserStatus(matchingUser) : 'active';
              const isCritical = (alert.attemptCount || 1) >= 3 || alert.severity === 'critical';

              return (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isCritical
                      ? 'bg-red-50/70 dark:bg-red-950/20 border-red-300 dark:border-red-800/80 shadow-xs'
                      : 'bg-amber-50/50 dark:bg-amber-950/15 border-amber-200 dark:border-amber-800/60'
                  }`}
                >
                  {/* Left: User Info & Tool Details */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <img
                      src={alert.userPhotoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(alert.userName || alert.userEmail)}`}
                      alt={alert.userName}
                      className="w-11 h-11 rounded-full object-cover border-2 border-red-500/50 shrink-0 shadow-2xs"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(alert.userEmail || 'user')}`);
                      }}
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                          {alert.userName || 'Utilisateur'}
                        </span>
                        
                        <span className="text-xs text-gray-500 font-mono">
                          ({alert.userEmail || alert.userId})
                        </span>

                        {/* Attempt count badge */}
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            isCritical
                              ? 'bg-red-600 text-white shadow-2xs animate-pulse'
                              : 'bg-amber-600 text-white shadow-2xs'
                          }`}
                        >
                          <AlertTriangle size={12} />
                          <span>{alert.attemptCount} tentative{alert.attemptCount > 1 ? 's' : ''}</span>
                        </span>

                        <span className="text-[11px] text-gray-400 font-medium ml-auto sm:ml-0">
                          {formatTimeAgo(alert.lastAttemptAt)}
                        </span>
                      </div>

                      {/* Tool & restriction info */}
                      <div className="flex items-center gap-2 flex-wrap text-xs text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700">
                          🎯 Outil cible : <strong>{alert.toolName}</strong> ({alert.toolId})
                        </span>
                        <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-md font-bold text-[11px]">
                          Type : {alert.restrictionType === 'premium' ? '👑 Réservé Premium' : alert.restrictionType === 'maintenance' ? '🛠️ En Maintenance' : '🚫 Outil Bloqué'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Actions & Status Changer */}
                  <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-200/60 dark:border-gray-700/60">
                    {/* Quick Status Selector */}
                    {matchingUser && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Statut Compte</span>
                        <UserQuickStatusPicker
                          currentStatus={resolvedStatus}
                          userId={alert.userId}
                          userName={alert.userName}
                          onStatusChange={onSetUserStatus}
                          size="sm"
                          layout="segmented"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 self-end">
                      {matchingUser && onOpenUserDetail && (
                        <button
                          type="button"
                          onClick={() => onOpenUserDetail(matchingUser)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                          title="Voir le profil complet de cet utilisateur"
                        >
                          <Eye size={14} />
                          <span className="hidden sm:inline">Profil</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDismiss(alert.id)}
                        className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        title="Marquer comme résolu / Ignorer"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
