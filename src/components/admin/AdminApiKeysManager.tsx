import React, { useState, useEffect } from 'react';
import {
  Key,
  ShieldAlert,
  Activity,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sliders,
  Trash2,
  Zap,
  Globe,
  Lock,
  Unlock,
  ShieldCheck,
  Server,
  ArrowUpRight,
  TrendingUp,
  Clock,
  UserCheck
} from 'lucide-react';

interface ApiKeyRecord {
  id: string;
  key: string;
  name: string;
  userId?: string;
  rateLimit: number;
  createdAt: number;
  lastUsedAt?: number;
  status: 'active' | 'revoked' | 'blocked';
  totalRequests?: number;
  abuseCount?: number;
  lastIp?: string;
  lastEndpoint?: string;
}

interface AbuseAlert {
  id: string;
  keyId: string;
  keyName: string;
  keyString: string;
  userId?: string;
  timestamp: number;
  ip: string;
  endpoint: string;
  reason: string;
  limit: number;
  attemptedCount: number;
}

interface StatsSummary {
  totalKeys: number;
  activeKeys: number;
  blockedKeys: number;
  totalRequests: number;
  totalAbuseCount: number;
  totalAlerts: number;
}

export const AdminApiKeysManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [abuseAlerts, setAbuseAlerts] = useState<AbuseAlert[]>([]);
  const [summary, setSummary] = useState<StatsSummary>({
    totalKeys: 0,
    activeKeys: 0,
    blockedKeys: 0,
    totalRequests: 0,
    totalAbuseCount: 0,
    totalAlerts: 0
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked' | 'abuse'>('all');
  const [activeTab, setActiveTab] = useState<'keys' | 'alerts' | 'user_limits'>('keys');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  // Editing rate limit state
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
  const [customRateLimit, setCustomRateLimit] = useState<number>(60);
  const [isUpdating, setIsUpdating] = useState(false);

  // User Profile Rate Limit (Firestore api_rate_limit) state
  const [targetUserId, setTargetUserId] = useState('');
  const [userProfileData, setUserProfileData] = useState<{ rateLimit: number; isBlocked: boolean } | null>(null);
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [isSavingUserQuota, setIsSavingUserQuota] = useState(false);
  const [userFeedbackMsg, setUserFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleFetchUserProfileLimit = async (uidToFetch?: string) => {
    const uid = (uidToFetch || targetUserId).trim();
    if (!uid) return;
    setIsSearchingUser(true);
    setUserFeedbackMsg(null);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(uid)}/rate-limit`);
      const data = await res.json();
      if (data.success) {
        setUserProfileData({
          rateLimit: data.api_rate_limit || 60,
          isBlocked: !!data.isBlocked
        });
      } else {
        setUserFeedbackMsg({ text: data.error || "Utilisateur introuvable", type: 'error' });
      }
    } catch (err: any) {
      setUserFeedbackMsg({ text: err.message || "Erreur de connexion", type: 'error' });
    } finally {
      setIsSearchingUser(false);
    }
  };

  const handleSaveUserProfileLimit = async () => {
    if (!targetUserId.trim() || !userProfileData) return;
    setIsSavingUserQuota(true);
    setUserFeedbackMsg(null);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(targetUserId.trim())}/rate-limit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rateLimit: userProfileData.rateLimit,
          isBlocked: userProfileData.isBlocked
        })
      });
      const data = await res.json();
      if (data.success) {
        setUserFeedbackMsg({ text: data.message || "Quota mis à jour avec succès dans Firestore !", type: 'success' });
      } else {
        setUserFeedbackMsg({ text: data.error || "Erreur lors de la mise à jour", type: 'error' });
      }
    } catch (err: any) {
      setUserFeedbackMsg({ text: err.message || "Erreur réseau", type: 'error' });
    } finally {
      setIsSavingUserQuota(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/api-keys/stats');
      const data = await res.json();
      if (data.success) {
        setKeys(data.keys || []);
        setAbuseAlerts(data.abuseAlerts || []);
        setSummary(data.summary || {
          totalKeys: 0,
          activeKeys: 0,
          blockedKeys: 0,
          totalRequests: 0,
          totalAbuseCount: 0,
          totalAlerts: 0
        });
      }
    } catch (err) {
      console.error('Error fetching API key stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const toggleRevealKey = (id: string) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleKeyStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      const res = await fetch(`/api/admin/api-keys/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setKeys(prev => prev.map(k => (k.id === id || k.key === id) ? { ...k, status: nextStatus } : k));
        setSummary(prev => ({
          ...prev,
          activeKeys: nextStatus === 'active' ? prev.activeKeys + 1 : prev.activeKeys - 1,
          blockedKeys: nextStatus === 'blocked' ? prev.blockedKeys + 1 : prev.blockedKeys - 1
        }));
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleSaveRateLimit = async (id: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/api-keys/${id}/rate-limit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rateLimit: customRateLimit })
      });
      const data = await res.json();
      if (data.success) {
        setKeys(prev => prev.map(k => (k.id === id || k.key === id) ? { ...k, rateLimit: customRateLimit } : k));
        setEditingKeyId(null);
      }
    } catch (err) {
      console.error('Update rate limit error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearAbuseAlerts = async () => {
    if (!window.confirm("Voulez-vous réinitialiser le journal des alertes d'abus ?")) return;
    try {
      await fetch('/api/admin/api-keys/abuse-alerts/clear', { method: 'POST' });
      setAbuseAlerts([]);
      setSummary(prev => ({ ...prev, totalAlerts: 0, totalAbuseCount: 0 }));
    } catch (err) {
      console.error('Clear alerts error:', err);
    }
  };

  const filteredKeys = keys.filter(k => {
    if (statusFilter === 'active' && k.status !== 'active') return false;
    if (statusFilter === 'blocked' && k.status !== 'blocked' && k.status !== 'revoked') return false;
    if (statusFilter === 'abuse' && (!k.abuseCount || k.abuseCount <= 0)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        k.name.toLowerCase().includes(q) ||
        k.key.toLowerCase().includes(q) ||
        (k.userId && k.userId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl border border-emerald-500/30 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Key size={14} className="text-emerald-400" />
            <span>Surveillance API & Limitation de Débit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Statistiques des Clés API & Protection Firestore
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
            Suivi des requêtes par clé, application des quotas dynamiques (<code className="text-amber-300 font-mono">api_rate_limit</code>) des profils utilisateurs et détection automatique des abus.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-emerald-400" : "text-emerald-400"} />
            <span>Actualiser</span>
          </button>

          {abuseAlerts.length > 0 && (
            <button
              onClick={handleClearAbuseAlerts}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Purger les alertes</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Keys */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Clés API</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Key size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {summary.totalKeys}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{summary.activeKeys} actives</span>
            <span>•</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">{summary.blockedKeys} bloquées</span>
          </div>
        </div>

        {/* Total Requests */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Volume Requêtes</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {summary.totalRequests.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center gap-1">
            <Globe size={12} className="text-emerald-500" />
            <span>Trafic externe autorisé</span>
          </div>
        </div>

        {/* Abuse Alerts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Alertes d'Abus (429)</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${summary.totalAlerts > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}`}>
            {summary.totalAlerts}
          </div>
          <div className="text-[11px] text-gray-500">
            {summary.totalAlerts > 0 ? (
              <span className="text-rose-600 dark:text-rose-400 font-bold">Quotas dépassés détectés</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Aucun incident de débit</span>
            )}
          </div>
        </div>

        {/* Quota System */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Moteur de Débit</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Zap size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
            Firestore Sync
          </div>
          <div className="text-[11px] text-gray-500 truncate">
            Champ: <code className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">api_rate_limit</code>
          </div>
        </div>
      </div>

      {/* Tabs navigation: Keys vs Abuse Alerts */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('keys')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'keys'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Key size={14} />
          <span>Gestionnaire de Clés ({keys.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <ShieldAlert size={14} />
          <span>Journal des Abus & Dépassements</span>
          {abuseAlerts.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-rose-700">
              {abuseAlerts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('user_limits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'user_limits'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Sliders size={14} />
          <span>Quotas Profils (api_rate_limit Firestore)</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: API KEYS TABLE & MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'keys' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-4 shadow-xs">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, clé, userId..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto overflow-x-auto w-full sm:w-auto">
              {(['all', 'active', 'blocked', 'abuse'] as const).map((mode) => (
                <button
                  key={`filter-${mode}`}
                  onClick={() => setStatusFilter(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === mode
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {mode === 'all' && 'Toutes'}
                  {mode === 'active' && 'Actives'}
                  {mode === 'blocked' && 'Bloquées'}
                  {mode === 'abuse' && 'Avec Abus'}
                </button>
              ))}
            </div>
          </div>

          {/* Keys Table */}
          {filteredKeys.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              Aucune clé trouvée pour ces critères de recherche.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                <thead className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700/60">
                  <tr>
                    <th className="py-3 px-3">Application / Projet</th>
                    <th className="py-3 px-3">Clé API</th>
                    <th className="py-3 px-3">Quota Débit</th>
                    <th className="py-3 px-3">Requêtes</th>
                    <th className="py-3 px-3">Abus (429)</th>
                    <th className="py-3 px-3">Statut</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                  {filteredKeys.map((k) => {
                    const isRevealed = Boolean(revealedKeys[k.id]);
                    const displayKey = isRevealed ? k.key : `${k.key.slice(0, 10)}••••••••${k.key.slice(-4)}`;
                    const isBlocked = k.status === 'blocked';
                    const isRevoked = k.status === 'revoked';
                    const hasAbuse = (k.abuseCount || 0) > 0;

                    return (
                      <tr key={`key-row-${k.id}`} className="hover:bg-gray-50/60 dark:hover:bg-gray-750/50 transition-colors">
                        {/* Name & User */}
                        <td className="py-3 px-3">
                          <div className="font-extrabold text-gray-900 dark:text-white">
                            {k.name}
                          </div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <UserCheck size={11} className="text-emerald-500" />
                            <span>{k.userId || 'guest_developer'}</span>
                          </div>
                        </td>

                        {/* Key & Copy */}
                        <td className="py-3 px-3 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700 text-[11px]">
                              {displayKey}
                            </span>
                            <button
                              onClick={() => toggleRevealKey(k.id)}
                              className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                              title={isRevealed ? "Masquer" : "Révéler"}
                            >
                              {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                            <button
                              onClick={() => handleCopy(k.key, k.id)}
                              className="p-1 rounded text-gray-400 hover:text-emerald-600 cursor-pointer"
                              title="Copier la clé"
                            >
                              {copiedKeyId === k.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                            </button>
                          </div>
                        </td>

                        {/* Rate Limit */}
                        <td className="py-3 px-3">
                          {editingKeyId === k.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={10}
                                max={2000}
                                value={customRateLimit}
                                onChange={(e) => setCustomRateLimit(Number(e.target.value))}
                                className="w-16 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-900 border text-xs font-bold"
                              />
                              <button
                                onClick={() => handleSaveRateLimit(k.id)}
                                disabled={isUpdating}
                                className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]"
                              >
                                OK
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingKeyId(k.id);
                                setCustomRateLimit(k.rateLimit || 60);
                              }}
                              className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-[11px] flex items-center gap-1 hover:border-blue-400 cursor-pointer"
                              title="Cliquer pour ajuster le débit (synchronisé avec Firestore users)"
                            >
                              <span>{k.rateLimit} req/min</span>
                              <Sliders size={11} className="text-blue-500" />
                            </button>
                          )}
                        </td>

                        {/* Requests Total */}
                        <td className="py-3 px-3">
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            {(k.totalRequests || 0).toLocaleString()}
                          </span>
                        </td>

                        {/* Abuse count */}
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            hasAbuse 
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-black' 
                              : 'text-gray-400'
                          }`}>
                            {k.abuseCount || 0}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                            k.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300'
                              : isBlocked
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300'
                          }`}>
                            {k.status === 'active' && <CheckCircle2 size={11} />}
                            {isBlocked && <Lock size={11} />}
                            {isRevoked && <XCircle size={11} />}
                            <span>{k.status === 'active' ? 'ACTIF' : isBlocked ? 'BLOQUÉ' : 'RÉVOQUÉ'}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle block */}
                            <button
                              onClick={() => handleToggleKeyStatus(k.id, k.status)}
                              className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                k.status === 'active'
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              }`}
                              title={k.status === 'active' ? "Bloquer cette clé immédiatement" : "Débloquer cette clé"}
                            >
                              {k.status === 'active' ? <Lock size={13} /> : <Unlock size={13} />}
                              <span className="hidden sm:inline">
                                {k.status === 'active' ? 'Bloquer' : 'Activer'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ABUSE ALERTS LOG */}
      {/* ========================================================= */}
      {activeTab === 'alerts' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldAlert size={18} className="text-rose-500" />
                <span>Journal des Incidents & Alertes d'Abus en Temps Réel</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Chaque fois qu'une clé API ou une adresse IP dépasse son quota de débit ou tente un accès non autorisé, un incident est consigné ci-dessous.
              </p>
            </div>

            {abuseAlerts.length > 0 && (
              <button
                onClick={handleClearAbuseAlerts}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer"
              >
                Tout Effacer
              </button>
            )}
          </div>

          {abuseAlerts.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
              <div className="font-bold text-sm text-gray-900 dark:text-white">
                Aucun abus détecté
              </div>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Tous les clients respectent scrupuleusement les limitations de débit configurées dans leur profil Firestore.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {abuseAlerts.map((alert) => (
                <div
                  key={`alert-${alert.id}`}
                  className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200">
                        HTTP 429
                      </span>
                      <span className="font-extrabold text-gray-900 dark:text-white">
                        {alert.keyName}
                      </span>
                      <span className="text-[11px] font-mono text-gray-500">
                        (IP: {alert.ip})
                      </span>
                    </div>

                    <div className="text-rose-700 dark:text-rose-300 font-medium">
                      {alert.reason} • Route : <code className="font-mono bg-rose-100 dark:bg-rose-900/50 px-1 py-0.5 rounded">{alert.endpoint}</code>
                    </div>

                    <div className="text-[10px] text-gray-400 flex items-center gap-2">
                      <Clock size={11} />
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      {alert.limit > 0 && (
                        <span>• Quota : {alert.limit} req/min</span>
                      )}
                    </div>
                  </div>

                  {alert.keyId && alert.keyId !== 'unknown' && alert.keyId !== 'ip_limit' && (
                    <button
                      onClick={() => handleToggleKeyStatus(alert.keyId, 'active')}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 self-start sm:self-auto cursor-pointer"
                    >
                      Bloquer la clé
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: USER PROFILES RATE LIMIT (FIRESTORE api_rate_limit) */}
      {/* ========================================================= */}
      {activeTab === 'user_limits' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-6 shadow-xs">
          <div>
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Sliders size={18} className="text-amber-500" />
              <span>Configuration du Débit par Profil Utilisateur Firestore</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Consultez et modifiez directement le champ <code className="text-amber-600 dark:text-amber-400 font-mono font-bold">api_rate_limit</code> dans le document Firestore <code className="text-emerald-600 font-mono">users/{'{userId}'}</code>. Le middleware applique immédiatement ce quota prioritaire.
            </p>
          </div>

          {/* Search User Form */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">
              Identifiant Utilisateur Firebase (UID) :
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="text"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                placeholder="Ex: usr_admin_jibril, 589790290169, uid_client_pro..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs text-gray-900 dark:text-white outline-none focus:border-amber-500 font-mono"
              />
              <button
                type="button"
                onClick={() => handleFetchUserProfileLimit()}
                disabled={isSearchingUser || !targetUserId.trim()}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
              >
                {isSearchingUser ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                <span>Charger le profil</span>
              </button>
            </div>

            {/* Quick selectors from existing keys */}
            {keys.some(k => k.userId && k.userId !== 'guest_developer') && (
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1.5">
                  Utilisateurs actifs ayant des clés API :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(new Set(keys.map(k => k.userId).filter(Boolean))).map((uid) => (
                    <button
                      key={`uid-quick-${uid}`}
                      type="button"
                      onClick={() => {
                        setTargetUserId(uid as string);
                        handleFetchUserProfileLimit(uid as string);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-[11px] font-mono text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                    >
                      {uid}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Feedback Message */}
          {userFeedbackMsg && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              userFeedbackMsg.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300'
            }`}>
              {userFeedbackMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{userFeedbackMsg.text}</span>
            </div>
          )}

          {/* User Quota Editor */}
          {userProfileData && (
            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 dark:border-amber-900/60 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase text-amber-800 dark:text-amber-300 block">
                    Profil Utilisateur : {targetUserId}
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Mise à jour en temps réel dans la base Firestore
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    userProfileData.isBlocked
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300'
                  }`}>
                    {userProfileData.isBlocked ? 'Accès API Suspendu' : 'Accès API Autorisé'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">
                    Quota Limite de Débit (requêtes / minute) :
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={5}
                      max={5000}
                      value={userProfileData.rateLimit}
                      onChange={(e) => setUserProfileData(prev => prev ? { ...prev, rateLimit: Number(e.target.value) } : null)}
                      className="w-32 px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm font-bold font-mono text-gray-900 dark:text-white outline-none focus:border-amber-500"
                    />
                    <div className="flex items-center gap-1">
                      {[60, 120, 300, 600, 1000].map((preset) => (
                        <button
                          key={`preset-${preset}`}
                          type="button"
                          onClick={() => setUserProfileData(prev => prev ? { ...prev, rateLimit: preset } : null)}
                          className="px-2 py-1 rounded-lg bg-white dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-[10px] font-bold border border-gray-200 dark:border-gray-700 cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Définit le plafond appliqué par le middleware pour toutes les requêtes de cet utilisateur.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-200 block">
                    Statut de l'Accès API Développeur :
                  </label>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setUserProfileData(prev => prev ? { ...prev, isBlocked: !prev.isBlocked } : null)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        userProfileData.isBlocked
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      {userProfileData.isBlocked ? "Débloquer l'accès API" : "Suspendre l'accès API de cet utilisateur"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200 dark:border-amber-900/60 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveUserProfileLimit}
                  disabled={isSavingUserQuota}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 transition-all active:scale-95"
                >
                  {isSavingUserQuota ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  <span>Enregistrer dans Firestore</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
