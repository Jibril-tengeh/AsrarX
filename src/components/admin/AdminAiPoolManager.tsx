import React, { useState, useEffect } from 'react';
import { 
  Bot, Plus, Trash2, ArrowUp, ArrowDown, CheckCircle2, 
  AlertTriangle, RefreshCw, Eye, EyeOff, Zap, ShieldCheck, 
  Clock, Play, Edit3, X, HelpCircle, Layers
} from 'lucide-react';
import { getApiUrl } from '../../lib/api';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface AiApiKeyItem {
  id: string;
  name: string;
  provider: 'gemini' | 'inception' | 'openai' | 'groq' | 'mistral' | 'deepseek' | 'openrouter' | 'custom';
  apiKey: string;
  model: string;
  baseUrl?: string;
  active: boolean;
  priority: number;
  createdAt: number;
  lastUsedAt?: number;
  lastSuccessAt?: number;
  lastErrorAt?: number;
  lastErrorMessage?: string;
  cooldownUntil?: number;
  isCooldown?: boolean;
  cooldownRemainingSeconds?: number;
  maskedKey?: string;
  totalCalls?: number;
  successCalls?: number;
  failedCalls?: number;
}

interface AdminAiPoolManagerProps {
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const PROVIDER_METADATA: Record<string, { label: string; defaultModel: string; defaultUrl?: string; color: string }> = {
  inception: {
    label: 'Inception Labs (Mercury)',
    defaultModel: 'mercury-2.5',
    defaultUrl: 'https://api.inceptionlabs.ai/v1/chat/completions',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
  },
  gemini: {
    label: 'Google Gemini',
    defaultModel: 'gemini-3.1-flash-lite',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
  },
  groq: {
    label: 'Groq (Ultra-Rapide)',
    defaultModel: 'llama-3.3-70b-versatile',
    defaultUrl: 'https://api.groq.com/openai/v1/chat/completions',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
  },
  openai: {
    label: 'OpenAI (ChatGPT)',
    defaultModel: 'gpt-4o-mini',
    defaultUrl: 'https://api.openai.com/v1/chat/completions',
    color: 'bg-emerald-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30'
  },
  mistral: {
    label: 'Mistral AI',
    defaultModel: 'mistral-small-latest',
    defaultUrl: 'https://api.mistral.ai/v1/chat/completions',
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30'
  },
  deepseek: {
    label: 'DeepSeek',
    defaultModel: 'deepseek-chat',
    defaultUrl: 'https://api.deepseek.com/chat/completions',
    color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30'
  },
  openrouter: {
    label: 'OpenRouter (Multi-modèles)',
    defaultModel: 'google/gemini-2.5-flash',
    defaultUrl: 'https://openrouter.ai/api/v1/chat/completions',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
  },
  custom: {
    label: 'Fournisseur Personnalisé (Compatible OpenAI)',
    defaultModel: 'custom-model',
    color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30'
  }
};

export const AdminAiPoolManager: React.FC<AdminAiPoolManagerProps> = ({ showToast }) => {
  const [keys, setKeys] = useState<AiApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingKey, setEditingKey] = useState<AiApiKeyItem | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    id?: string;
    name: string;
    provider: AiApiKeyItem['provider'];
    apiKey: string;
    model: string;
    baseUrl: string;
    active: boolean;
  }>({
    name: '',
    provider: 'inception',
    apiKey: '',
    model: 'mercury-2.5',
    baseUrl: 'https://api.inceptionlabs.ai/v1/chat/completions',
    active: true
  });

  const [showKeySecret, setShowKeySecret] = useState(false);
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ keyId: string; success: boolean; message: string; latency?: number } | null>(null);
  const [modalTestResult, setModalTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);
  const [isModalTesting, setIsModalTesting] = useState(false);

  // Live Cascade Simulator states
  const [simulatorPrompt, setSimulatorPrompt] = useState('Explique en 2 phrases la portée spirituelle de la Sourate Al-Fatiha.');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResponse, setSimulationResponse] = useState<string | null>(null);

  const notify = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (showToast) {
      showToast(msg, type);
    } else {
      console.log(`[Notification ${type}] ${msg}`);
    }
  };

  // Fetch AI Pool
  const fetchPool = async () => {
    setLoading(true);
    try {
      // 1. Attempt backend fetch with resolved URL
      try {
        const res = await fetch(getApiUrl('/api/admin/ai-pool'));
        if (res.ok) {
          const data = await res.json();
          if (data.keys && Array.isArray(data.keys) && data.keys.length > 0) {
            setKeys(data.keys);
            try {
              localStorage.setItem('asrarhub_cached_ai_pool', JSON.stringify(data.keys));
            } catch (_) {}
            return;
          }
        }
      } catch (err: any) {
        console.warn("[AdminAiPoolManager] Backend fetch unavailable, trying Firestore fallback:", err?.message || err);
      }

      // 2. Fallback to Firestore if backend is offline or unreachable
      try {
        const snap = await getDoc(doc(db, "settings", "ai_api_pool"));
        if (snap.exists() && snap.data()?.keys && Array.isArray(snap.data().keys)) {
          const firestoreKeys = snap.data().keys;
          setKeys(firestoreKeys);
          try {
            localStorage.setItem('asrarhub_cached_ai_pool', JSON.stringify(firestoreKeys));
          } catch (_) {}
          return;
        }
      } catch (fErr) {
        console.warn("[AdminAiPoolManager] Firestore fallback check failed:", fErr);
      }

      // 3. Fallback to local storage cache
      try {
        const cached = localStorage.getItem('asrarhub_cached_ai_pool');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setKeys(parsed);
            return;
          }
        }
      } catch (_) {}

      // Default keys fallback to maintain a functional UI
      setKeys([
        {
          id: 'key_inception_default',
          name: 'Inception Labs (Mercury 2.5 - Prioritaire)',
          provider: 'inception',
          apiKey: '',
          model: 'mercury-2.5',
          baseUrl: 'https://api.inceptionlabs.ai/v1/chat/completions',
          active: true,
          priority: 1,
          createdAt: Date.now()
        },
        {
          id: 'key_gemini_default',
          name: 'Google Gemini (Flash Lite - Relais)',
          provider: 'gemini',
          apiKey: '',
          model: 'gemini-3.1-flash-lite',
          active: true,
          priority: 2,
          createdAt: Date.now()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPool();
  }, []);

  // Save pool updates
  const savePoolToServer = async (updatedKeys: AiApiKeyItem[]) => {
    setSaving(true);
    let serverOk = false;
    try {
      const res = await fetch(getApiUrl('/api/admin/ai-pool'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: updatedKeys })
      });
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || updatedKeys);
        serverOk = true;
      }
    } catch (err: any) {
      console.warn("[AdminAiPoolManager] Direct server save warning:", err);
    }

    // Always mirror to Firestore & local storage for cross-platform resilience
    try {
      await setDoc(doc(db, "settings", "ai_api_pool"), {
        keys: updatedKeys,
        updatedAt: Date.now()
      }, { merge: true });
      try {
        localStorage.setItem('asrarhub_cached_ai_pool', JSON.stringify(updatedKeys));
      } catch (_) {}
      setKeys(updatedKeys);
      notify("Configuration de la cascade d'API enregistrée avec succès !", "success");
      return true;
    } catch (fErr: any) {
      if (serverOk) {
        notify("Configuration enregistrée sur le serveur !", "success");
        return true;
      }
      notify("Erreur lors de la sauvegarde : " + (fErr?.message || "Échec réseau"), "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Toggle active status
  const toggleKeyActive = async (id: string) => {
    const updated = keys.map(k => k.id === id ? { ...k, active: !k.active } : k);
    setKeys(updated);
    await savePoolToServer(updated);
  };

  // Reorder priorities (Move Up / Down)
  const movePriority = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === keys.length - 1)) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...keys];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update priorities sequentially
    const updated = reordered.map((k, idx) => ({ ...k, priority: idx + 1 }));
    setKeys(updated);
    await savePoolToServer(updated);
  };

  // Delete key
  const handleDeleteKey = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'API "${name}" de la cascade ?`)) {
      return;
    }
    const filtered = keys.filter(k => k.id !== id).map((k, idx) => ({ ...k, priority: idx + 1 }));
    setKeys(filtered);
    await savePoolToServer(filtered);
  };

  // Open modal for new key
  const handleOpenAddModal = () => {
    setEditingKey(null);
    setFormData({
      name: `Nouvelle API IA (${keys.length + 1})`,
      provider: 'inception',
      apiKey: '',
      model: PROVIDER_METADATA.inception.defaultModel,
      baseUrl: PROVIDER_METADATA.inception.defaultUrl || '',
      active: true
    });
    setShowKeySecret(false);
    setModalTestResult(null);
    setShowAddModal(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (key: AiApiKeyItem) => {
    setEditingKey(key);
    setFormData({
      id: key.id,
      name: key.name,
      provider: key.provider,
      apiKey: key.apiKey || '',
      model: key.model,
      baseUrl: key.baseUrl || '',
      active: key.active
    });
    setShowKeySecret(false);
    setModalTestResult(null);
    setShowAddModal(true);
  };

  // Provider change in form
  const handleProviderChange = (provider: AiApiKeyItem['provider']) => {
    const meta = PROVIDER_METADATA[provider];
    setFormData(prev => ({
      ...prev,
      provider,
      model: meta?.defaultModel || prev.model,
      baseUrl: meta?.defaultUrl || ''
    }));
  };

  // Submit Modal Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      notify("Veuillez indiquer un libellé pour l'API", "error");
      return;
    }
    if (!formData.apiKey.trim() && !editingKey) {
      notify("Veuillez saisir la clé API", "error");
      return;
    }

    let updatedKeys: AiApiKeyItem[];
    if (editingKey) {
      updatedKeys = keys.map(k => {
        if (k.id === editingKey.id) {
          return {
            ...k,
            name: formData.name.trim(),
            provider: formData.provider,
            apiKey: formData.apiKey.trim() || k.apiKey,
            model: formData.model.trim(),
            baseUrl: formData.baseUrl.trim() || undefined,
            active: formData.active
          };
        }
        return k;
      });
    } else {
      const newKey: AiApiKeyItem = {
        id: `api_${Date.now()}`,
        name: formData.name.trim(),
        provider: formData.provider,
        apiKey: formData.apiKey.trim(),
        model: formData.model.trim(),
        baseUrl: formData.baseUrl.trim() || undefined,
        active: formData.active,
        priority: keys.length + 1,
        createdAt: Date.now(),
        totalCalls: 0,
        successCalls: 0,
        failedCalls: 0
      };
      updatedKeys = [...keys, newKey];
    }

    const ok = await savePoolToServer(updatedKeys);
    if (ok) {
      setShowAddModal(false);
    }
  };

  // Test live connection for an individual key
  const handleTestKey = async (key: AiApiKeyItem) => {
    setTestingKeyId(key.id);
    setTestResult(null);
    try {
      const res = await fetch(getApiUrl('/api/admin/ai-pool/test'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId: key.id })
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({
          keyId: key.id,
          success: true,
          message: `Réponse: "${data.response}" (${data.model})`,
          latency: data.latencyMs
        });
        notify(`Connexion réussie avec ${key.name} (${data.latencyMs}ms)`, "success");
      } else {
        setTestResult({
          keyId: key.id,
          success: false,
          message: data.isQuotaExceeded 
            ? `QUOTA ÉPUISÉ (429/Tokens): ${data.error}` 
            : `Erreur: ${data.error}`
        });
        notify(`Échec du test : ${data.error}`, "error");
      }
    } catch (err: any) {
      setTestResult({
        keyId: key.id,
        success: false,
        message: `Erreur réseau : ${err.message}`
      });
    } finally {
      setTestingKeyId(null);
    }
  };

  // Test in modal before saving
  const handleTestInModal = async () => {
    if (!formData.apiKey.trim() && !editingKey?.apiKey) {
      notify("Veuillez saisir une clé API pour la tester", "error");
      return;
    }
    setIsModalTesting(true);
    setModalTestResult(null);
    try {
      const res = await fetch(getApiUrl('/api/admin/ai-pool/test'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: formData.apiKey.trim() || editingKey?.apiKey,
          provider: formData.provider,
          model: formData.model.trim(),
          baseUrl: formData.baseUrl.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setModalTestResult({
          success: true,
          message: `Connexion établie ! Réponse reçue : "${data.response}"`,
          latency: data.latencyMs
        });
        notify(`API valide ! Latence : ${data.latencyMs}ms`, "success");
      } else {
        setModalTestResult({
          success: false,
          message: data.isQuotaExceeded 
            ? `Quota dépassé / Surcharge : ${data.error}` 
            : `Échec : ${data.error}`
        });
      }
    } catch (err: any) {
      setModalTestResult({
        success: false,
        message: `Erreur de connexion : ${err.message}`
      });
    } finally {
      setIsModalTesting(false);
    }
  };

  // Reset Cooldowns
  const handleResetCooldowns = async () => {
    try {
      const res = await fetch(getApiUrl('/api/admin/ai-pool/reset-cooldown'), { method: 'POST' });
      if (res.ok) {
        notify("Tous les quotas temporaires et cooldowns ont été réinitialisés !", "success");
        fetchPool();
      }
    } catch (e) {
      notify("Erreur lors de la réinitialisation", "error");
    }
  };

  // Run full cascade simulation
  const handleRunCascadeSimulation = async () => {
    if (!simulatorPrompt.trim()) return;
    setIsSimulating(true);
    setSimulationResponse(null);
    try {
      const res = await fetch(getApiUrl('/api/assistant/faq'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: simulatorPrompt, language: 'fr' })
      });
      const data = await res.json();
      if (data.answer) {
        setSimulationResponse(data.answer);
        notify("Simulation complétée avec succès via la cascade !", "success");
        // refresh pool stats to see updated call counts
        fetchPool();
      } else {
        setSimulationResponse(`Erreur : ${data.error || 'Aucune réponse reçue'}`);
      }
    } catch (err: any) {
      setSimulationResponse(`Erreur réseau : ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const activeKeysCount = keys.filter(k => k.active && (!k.cooldownUntil || k.cooldownUntil <= Date.now())).length;
  const inCooldownCount = keys.filter(k => k.active && k.cooldownUntil && k.cooldownUntil > Date.now()).length;

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Stats */}
      <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-gray-900/40 border border-indigo-500/30 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Layers size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Gestion Multi-API & Relais Automatique (Failover)
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Actif
                </span>
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Si les tokens ou le quota d'une API sont épuisés (Erreur 429), l'API suivante dans la cascade prend le contrôle immédiatement.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetCooldowns}
              title="Réinitialiser les pauses de quota pour toutes les clés"
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Réinitialiser Quotas</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow-emerald-600/20 hover:scale-[1.02]"
            >
              <Plus size={16} className="stroke-[2.5]" />
              <span>Ajouter une API</span>
            </button>
          </div>
        </div>

        {/* Realtime Status Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-indigo-500/20">
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <span className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400 block">Total Clés</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{keys.length} configurée{keys.length > 1 ? 's' : ''}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
            <span className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400 block">Prêtes en Production</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{activeKeysCount} opérationnelle{activeKeysCount > 1 ? 's' : ''}</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30">
            <span className="text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400 block">Pause Quota (Relais actif)</span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{inCooldownCount} en pause 5min</span>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
            <span className="text-[10px] font-semibold uppercase text-indigo-600 dark:text-indigo-400 block">Mode de Bascule</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mt-1">
              <Zap size={13} className="text-indigo-500" /> Cascade Prioritaire
            </span>
          </div>
        </div>
      </div>

      {/* 2. Educational Note Banner */}
      <div className="flex items-start gap-3 p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs text-blue-800 dark:text-blue-300">
        <HelpCircle size={18} className="shrink-0 text-blue-500 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block mb-0.5">Principe de la Bascule Automatique en Cascade :</span>
          L'API <strong>#1</strong> traite toutes les requêtes en priorité. Dès qu'elle retourne un code d'erreur de débit ou de tokens épuisés (erreur 429 ou quota atteint), le serveur la place en pause protectrice de 5 minutes et <strong>transfère instantanément l'exécution à l'API #2</strong>, puis #3 si nécessaire. L'utilisateur final ne subit aucune interruption !
        </div>
      </div>

      {/* 3. Ordered Keys List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            Ordre de Priorité de la Cascade (Déroulement du Relais)
          </span>
          <span className="text-[11px] text-gray-500">
            Utilisez les flèches ▲ ▼ pour réorganiser la priorité
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500 text-xs">
            <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-indigo-500" />
            Chargement des clés API...
          </div>
        ) : keys.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
            <Bot size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Aucune API configurée dans le pool. Cliquez sur "+ Ajouter une API" pour en ajouter une.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {keys.map((keyItem, index) => {
              const meta = PROVIDER_METADATA[keyItem.provider] || PROVIDER_METADATA.custom;
              const isFirst = index === 0;
              const isLast = index === keys.length - 1;
              const inCooldown = keyItem.cooldownUntil && keyItem.cooldownUntil > Date.now();
              const isTesting = testingKeyId === keyItem.id;
              const thisTestResult = testResult?.keyId === keyItem.id ? testResult : null;

              return (
                <div
                  key={keyItem.id ? `ai-pool-key-${keyItem.id}-${index}` : `ai-pool-key-${index}`}
                  className={`p-4 rounded-2xl border transition-all ${
                    inCooldown
                      ? 'bg-amber-500/5 border-amber-500/40'
                      : keyItem.active
                      ? isFirst
                        ? 'bg-gradient-to-r from-emerald-500/10 via-white to-white dark:from-emerald-950/20 dark:via-gray-800 dark:to-gray-800 border-emerald-500/40 shadow-xs'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Priority Badge, Details */}
                    <div className="flex items-start sm:items-center gap-3">
                      {/* Priority Circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isFirst
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        #{keyItem.priority}
                      </div>

                      {/* Main Title & Provider */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {keyItem.name}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${meta.color}`}>
                            {meta.label}
                          </span>
                          {isFirst && keyItem.active && !inCooldown && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                              ★ Principale
                            </span>
                          )}
                          {!isFirst && keyItem.active && !inCooldown && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                              Relais #{keyItem.priority - 1}
                            </span>
                          )}
                          {inCooldown && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 animate-pulse">
                              <Clock size={11} />
                              Quota Dépassé (Relais actif)
                            </span>
                          )}
                        </div>

                        {/* Subtitle / Model / Key masked */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>Modèle : <strong className="text-gray-700 dark:text-gray-300">{keyItem.model}</strong></span>
                          <span>Clé : <code className="bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded font-mono text-[11px]">{keyItem.maskedKey || '••••••••'}</code></span>
                          {keyItem.totalCalls !== undefined && (
                            <span className="text-[11px]">
                              Appels : <strong>{keyItem.successCalls || 0}</strong> succès / {keyItem.failedCalls || 0} échecs
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      {/* Priority Up/Down */}
                      <div className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          disabled={isFirst || saving}
                          onClick={() => movePriority(index, 'up')}
                          title="Augmenter la priorité"
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors cursor-pointer"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={isLast || saving}
                          onClick={() => movePriority(index, 'down')}
                          title="Diminuer la priorité"
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors border-t border-gray-200 dark:border-gray-700 cursor-pointer"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>

                      {/* Test Button */}
                      <button
                        type="button"
                        disabled={isTesting}
                        onClick={() => handleTestKey(keyItem)}
                        title="Tester cette clé en direct"
                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Play size={12} className={isTesting ? 'animate-spin' : ''} />
                        <span>{isTesting ? 'Test...' : 'Tester'}</span>
                      </button>

                      {/* Active Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleKeyActive(keyItem.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          keyItem.active
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {keyItem.active ? 'Actif' : 'Inactif'}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(keyItem)}
                        title="Modifier"
                        className="p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 size={15} />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteKey(keyItem.id, keyItem.name)}
                        title="Supprimer"
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Inline Test Result Box */}
                  {thisTestResult && (
                    <div className={`mt-3 p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 ${
                      thisTestResult.success
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        {thisTestResult.success ? (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        ) : (
                          <AlertTriangle size={16} className="text-rose-500 shrink-0" />
                        )}
                        <span>{thisTestResult.message}</span>
                      </div>
                      {thisTestResult.latency && (
                        <span className="font-mono text-[11px] font-bold shrink-0">
                          {thisTestResult.latency} ms
                        </span>
                      )}
                    </div>
                  )}

                  {/* Inline Last Error Message if Quota Reached */}
                  {keyItem.lastErrorMessage && inCooldown && (
                    <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg font-mono">
                      Dernier retour API : {keyItem.lastErrorMessage}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Live Relay Simulator */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap size={14} className="text-amber-500" />
            Simulateur de Relais en Direct
          </span>
          <span className="text-[11px] text-gray-500">
            Valide la réponse à travers la cascade active
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={simulatorPrompt}
            onChange={(e) => setSimulatorPrompt(e.target.value)}
            placeholder="Posez une question pour tester la cascade..."
            className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            disabled={isSimulating}
            onClick={handleRunCascadeSimulation}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Play size={13} className={isSimulating ? 'animate-spin' : ''} />
            <span>{isSimulating ? 'Génération...' : 'Tester le Relais'}</span>
          </button>
        </div>

        {simulationResponse && (
          <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-indigo-200 dark:border-indigo-900 text-xs text-gray-800 dark:text-gray-200 leading-relaxed max-h-40 overflow-y-auto">
            <span className="text-[10px] font-bold text-indigo-500 block mb-1">
              Réponse reçue via la cascade opérationnelle :
            </span>
            <div className="whitespace-pre-wrap">{simulationResponse}</div>
          </div>
        )}
      </div>

      {/* 5. Modal: Add / Edit Key */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bot className="text-indigo-500" size={20} />
                {editingKey ? 'Modifier l\'API de la Cascade' : 'Ajouter une Nouvelle API IA'}
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 mt-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Nom ou Libellé de l'API *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Inception Mercury (Principal), Groq Llama 3 (Secours)"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Provider */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Fournisseur d'IA *
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) => handleProviderChange(e.target.value as any)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="inception">Inception Labs (mercury-2.5)</option>
                  <option value="gemini">Google Gemini (3.1-flash-lite / 3.8-flash)</option>
                  <option value="groq">Groq (Ultra-rapide Llama 3)</option>
                  <option value="openai">OpenAI (ChatGPT / GPT-4o-mini)</option>
                  <option value="mistral">Mistral AI (mistral-small)</option>
                  <option value="deepseek">DeepSeek (deepseek-chat)</option>
                  <option value="openrouter">OpenRouter (Multi-fournisseurs)</option>
                  <option value="custom">Autre (Compatible format OpenAI)</option>
                </select>
              </div>

              {/* API Key */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Clé API (Secret Key) {editingKey ? '(Laisser vide pour conserver)' : '*'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKeySecret(!showKeySecret)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 cursor-pointer"
                  >
                    {showKeySecret ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showKeySecret ? 'Masquer' : 'Afficher'}</span>
                  </button>
                </div>
                <input
                  type={showKeySecret ? 'text' : 'password'}
                  required={!editingKey}
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder={editingKey ? '•••••••••••••••• (Conservée inchangée)' : 'Collez votre clé API ici (ex: sk_...)'}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Target Model */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Modèle IA Cible *
                </label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Ex: mercury-2.5, gemini-3.1-flash-lite, gpt-4o-mini"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Base URL (Optional or Custom) */}
              {(formData.provider === 'custom' || formData.provider === 'openrouter' || formData.provider === 'groq' || formData.provider === 'inception') && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    URL du Endpoint API (Optionnel)
                  </label>
                  <input
                    type="url"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                    placeholder="https://api.inceptionlabs.ai/v1/chat/completions"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Active Toggle in Modal */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modal_key_active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="modal_key_active" className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                  Activer immédiatement cette clé dans la cascade
                </label>
              </div>

              {/* Modal Test Connectivity Button */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  disabled={isModalTesting}
                  onClick={handleTestInModal}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play size={13} className={isModalTesting ? 'animate-spin' : ''} />
                  <span>{isModalTesting ? 'Test en cours...' : 'Tester la connexion maintenant'}</span>
                </button>

                {modalTestResult && (
                  <div className={`mt-2 p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 ${
                    modalTestResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  }`}>
                    <span>{modalTestResult.message}</span>
                    {modalTestResult.latency && (
                      <span className="font-mono text-[11px] font-bold">{modalTestResult.latency} ms</span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : editingKey ? 'Mettre à jour' : 'Enregistrer dans la cascade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
