import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Search, 
  Filter, 
  Crown, 
  User, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Globe, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Edit3, 
  RefreshCw, 
  Download, 
  Shield, 
  MessageSquare, 
  Star, 
  Settings, 
  Save, 
  X,
  Phone,
  Sparkles,
  Inbox,
  Archive,
  Eye,
  FileText
} from 'lucide-react';
import { 
  SupportMessage, 
  AdminSupportConfig, 
  SupportStatus, 
  SupportPriority, 
  SupportCategory 
} from '../../types/support';
import { 
  subscribeAllSupportMessages, 
  updateSupportMessageStatus, 
  addSupportMessageReply, 
  deleteSupportMessage, 
  getAdminSupportConfig, 
  saveAdminSupportConfig, 
  generateGmailReplyToUserUrl, 
  generateMailtoUrl,
  DEFAULT_ADMIN_GMAIL
} from '../../services/SupportService';

export const AdminEmailSupportManager: React.FC = () => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);

  // Config State
  const [adminConfig, setAdminConfig] = useState<AdminSupportConfig>({
    linkedGmail: DEFAULT_ADMIN_GMAIL,
    autoOpenGmailCompose: true,
    emailNotificationsEnabled: true,
    supportPhoneWhatsapp: '+221 77 000 00 00',
    autoReplyMessage: ''
  });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editGmailInput, setEditGmailInput] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Reply state
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  useEffect(() => {
    getAdminSupportConfig().then(cfg => {
      setAdminConfig(cfg);
      setEditGmailInput(cfg.linkedGmail || DEFAULT_ADMIN_GMAIL);
    });

    const unsubscribe = subscribeAllSupportMessages((msgs) => {
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedMessage) {
      const refreshed = messages.find(m => m.id === selectedMessage.id);
      if (refreshed) {
        setSelectedMessage(refreshed);
        setAdminNoteInput(refreshed.adminNotes || '');
      }
    }
  }, [messages]);

  const handleSelectMessage = async (msg: SupportMessage) => {
    setSelectedMessage(msg);
    setAdminNoteInput(msg.adminNotes || '');
    if (msg.status === 'unread') {
      await updateSupportMessageStatus(msg.id, 'read');
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGmailInput.trim()) return;
    setSavingConfig(true);
    try {
      const updated = await saveAdminSupportConfig({
        ...adminConfig,
        linkedGmail: editGmailInput.trim()
      });
      setAdminConfig(updated);
      setShowConfigModal(false);
    } catch (err) {
      console.error('Error saving support config:', err);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSendAppReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    setSendingReply(true);
    try {
      await addSupportMessageReply(selectedMessage.id, {
        sender: 'admin',
        senderName: 'Direction Spirituelle AsrarHub',
        senderEmail: adminConfig.linkedGmail,
        message: replyText.trim()
      });
      setReplyText('');
    } catch (err) {
      console.error('Failed to add reply:', err);
    } finally {
      setSendingReply(false);
    }
  };

  const handleStatusChange = async (msgId: string, status: SupportStatus) => {
    await updateSupportMessageStatus(msgId, status);
  };

  const handleDelete = async (msgId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer définitivement ce message ?')) {
      await deleteSupportMessage(msgId);
      if (selectedMessage?.id === msgId) {
        setSelectedMessage(null);
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportMessagesCSV = () => {
    const headers = ['Ticket', 'Date', 'Nom', 'Email', 'Statut Compte', 'Priorite', 'Categorie', 'Sujet', 'Statut Ticket', 'Appareil', 'Message'];
    const rows = filteredMessages.map(m => [
      m.ticketNumber,
      new Date(m.createdAt).toISOString(),
      `"${m.userName.replace(/"/g, '""')}"`,
      m.userEmail,
      m.isPremium ? 'PREMIUM' : 'STANDARD',
      m.priority,
      m.category,
      `"${m.subject.replace(/"/g, '""')}"`,
      m.status,
      `"${m.deviceInfo?.os || ''} / ${m.deviceInfo?.browser || ''}"`,
      `"${m.message.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `support_messages_asrarhub_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered list
  const filteredMessages = messages.filter(m => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        m.ticketNumber.toLowerCase().includes(q) ||
        m.userName.toLowerCase().includes(q) ||
        m.userEmail.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q) ||
        (m.userPhone && m.userPhone.includes(q));
      if (!match) return false;
    }

    // Status
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;

    // Tier
    if (tierFilter === 'premium' && !m.isPremium) return false;
    if (tierFilter === 'standard' && (m.isPremium || m.accountTier === 'trial')) return false;
    if (tierFilter === 'trial' && m.accountTier !== 'trial') return false;

    // Priority
    if (priorityFilter !== 'all' && m.priority !== priorityFilter) return false;

    // Category
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;

    return true;
  });

  // Metrics
  const totalCount = messages.length;
  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const premiumCount = messages.filter(m => m.isPremium).length;
  const resolvedCount = messages.filter(m => m.status === 'resolved').length;

  const quickTemplates = [
    {
      title: 'Accusé de réception',
      text: 'Assalam Alaykoum. Nous avons bien reçu votre demande. Notre équipe examine votre situation et vous apporte une solution sous peu.'
    },
    {
      title: 'Validation Premium',
      text: 'Assalam Alaykoum. Votre compte Premium a bien été vérifié et activé avec succès. Vous bénéficiez désormais de l\'accès complet à tous les secrets et outils.'
    },
    {
      title: 'Assistance Technique',
      text: 'Assalam Alaykoum. Le problème technique mentionné a été pris en charge. Nous vous invitons à vider le cache de l\'application et à relancer.'
    },
    {
      title: 'Conseil Spirituel',
      text: 'Assalam Alaykoum. Concernant votre pratique spirituelle, nous vous recommandons de respecter les heures planétaires associées pour maximiser la résonance.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Linked Gmail & Receiver Engine */}
      <div className="bg-gradient-to-r from-gray-900 via-emerald-950 to-gray-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                <Mail size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                  <span>Récepteur Professionnel d'E-mails & Support</span>
                  <span className="text-xs px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-bold border border-emerald-500/30">
                    Live Sync
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-300">
                  Tous les messages utilisateurs, détails de comptes (Premium/Standard), et diagnostics techniques.
                </p>
              </div>
            </div>

            {/* Linked Gmail pill */}
            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-xs font-mono border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-gray-300">Gmail Administrateur Lié :</span>
                <strong className="text-emerald-300">{adminConfig.linkedGmail || DEFAULT_ADMIN_GMAIL}</strong>
              </div>

              <button
                onClick={() => setShowConfigModal(true)}
                className="text-xs text-emerald-300 hover:text-emerald-200 font-bold underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 size={13} />
                Changer l'e-mail lié
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Mail size={15} />
              Ouvrir Boîte Gmail
              <ExternalLink size={12} />
            </a>

            <button
              onClick={exportMessagesCSV}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
            >
              <Download size={15} />
              Exporter CSV
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total Reçus</p>
            <h4 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{totalCount}</h4>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Inbox size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Non Lus</p>
            <h4 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-2">
              <span>{unreadCount}</span>
              {unreadCount > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
            </h4>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl">
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Membres VIP / Premium</p>
            <h4 className="text-2xl font-black text-amber-500 mt-1">{premiumCount}</h4>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Crown size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Résolus</p>
            <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{resolvedCount}</h4>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, email, ticket, sujet ou mot-clé..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Quick Filter Selects */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white outline-none font-bold"
            >
              <option value="all">Tous les Statuts ({messages.length})</option>
              <option value="unread">Non lus ({messages.filter(m => m.status === 'unread').length})</option>
              <option value="read">Lus</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolus</option>
              <option value="archived">Archivés</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white outline-none font-bold"
            >
              <option value="all">Tous les Comptes</option>
              <option value="premium">⭐ Membres Premium</option>
              <option value="standard">👤 Membres Standard</option>
              <option value="trial">⏳ Essai 24h</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white outline-none font-bold"
            >
              <option value="all">Toutes Priorités</option>
              <option value="urgent">🔴 Urgente</option>
              <option value="high">🟡 Haute</option>
              <option value="normal">🟢 Normale</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Message List (Left) + Detail Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Messages List (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col max-h-[850px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-850">
            <span className="font-bold text-xs text-gray-700 dark:text-gray-300">
              Boîte de Réception ({filteredMessages.length})
            </span>
            <span className="text-[11px] text-gray-400">
              Trié par date décroissante
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-750">
            {loading ? (
              <div className="py-12 text-center">
                <RefreshCw className="animate-spin text-emerald-500 mx-auto mb-2" size={24} />
                <p className="text-xs text-gray-400">Chargement des messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="py-12 text-center px-4">
                <Inbox className="text-gray-300 dark:text-gray-600 mx-auto mb-2" size={36} />
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Aucun message trouvé</p>
                <p className="text-xs text-gray-400 mt-1">Aucune correspondance avec les filtres appliqués.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;

                const statusBadges = {
                  unread: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-300/40',
                  read: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
                  in_progress: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
                  resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
                  archived: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                };

                const priorityDot = {
                  urgent: 'bg-red-500',
                  high: 'bg-amber-500',
                  normal: 'bg-emerald-500'
                };

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-l-4 border-emerald-500'
                        : msg.status === 'unread'
                          ? 'bg-amber-50/20 dark:bg-amber-950/10 hover:bg-gray-50 dark:hover:bg-gray-750'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${priorityDot[msg.priority] || 'bg-gray-400'}`} />
                        <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
                          {msg.userName}
                        </span>
                        {msg.isPremium && (
                          <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-[10px] font-black rounded-full flex items-center gap-0.5 shrink-0">
                            <Crown size={10} /> VIP
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                        {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="mt-1">
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                        {msg.subject}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                        {msg.message}
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {msg.ticketNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadges[msg.status]}`}>
                        {msg.status === 'unread' ? 'Non Lu' : msg.status === 'read' ? 'Lu' : msg.status === 'in_progress' ? 'En cours' : msg.status === 'resolved' ? 'Résolu' : 'Archivé'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Inspector / Detail Panel (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
          {selectedMessage ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {/* Ticket Header & Status Selector */}
              <div className="p-5 bg-gradient-to-r from-gray-50 to-emerald-50/20 dark:from-gray-850 dark:to-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                      {selectedMessage.ticketNumber}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                      {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      selectedMessage.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                      selectedMessage.priority === 'high' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    }`}>
                      Priorité {selectedMessage.priority}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">
                    {selectedMessage.subject}
                  </h3>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Statut :</span>
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value as SupportStatus)}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white outline-none"
                  >
                    <option value="unread">Non Lu</option>
                    <option value="read">Lu</option>
                    <option value="in_progress">En cours</option>
                    <option value="resolved">Résolu</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
              </div>

              {/* Complete User & Diagnostic Dossier */}
              <div className="p-5 bg-gray-50/50 dark:bg-gray-850/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <User size={14} className="text-emerald-500" />
                    Dossier Client & Profil Utilisateur
                  </h4>
                  {selectedMessage.isPremium ? (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 rounded-full font-black text-xs flex items-center gap-1">
                      <Crown size={13} /> ⭐ MEMBRE PREMIUM ACTIF ⭐
                    </span>
                  ) : selectedMessage.accountTier === 'trial' ? (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full font-bold text-xs">
                      ⏳ Essai 24h Actif
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full font-bold text-xs">
                      👤 Compte Standard / Gratuit
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Nom & Identité</span>
                    <p className="font-bold text-gray-900 dark:text-white truncate">{selectedMessage.userName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{selectedMessage.userEmail}</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Contact & Localisation</span>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {selectedMessage.userPhone ? (
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-emerald-500" />
                          {selectedMessage.userPhone}
                        </span>
                      ) : (
                        'Tel non renseigné'
                      )}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Pays : {selectedMessage.userCountry || 'Inconnu'}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 sm:col-span-2 md:col-span-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Points & UID</span>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {selectedMessage.spiritualPoints || 0} pts spirituels
                    </p>
                    <button
                      onClick={() => copyToClipboard(selectedMessage.userId, 'uid')}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1 truncate"
                    >
                      {copiedId === 'uid' ? <Check size={11} /> : <Copy size={11} />}
                      UID: {selectedMessage.userId.substring(0, 10)}...
                    </button>
                  </div>
                </div>

                {/* Technical Diagnostic Badges */}
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2 flex-wrap text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      {selectedMessage.deviceInfo?.deviceType === 'mobile' ? <Smartphone size={14} /> :
                       selectedMessage.deviceInfo?.deviceType === 'tablet' ? <Tablet size={14} /> :
                       <Laptop size={14} />}
                      <strong>{selectedMessage.deviceInfo?.os || 'OS'}</strong> ({selectedMessage.deviceInfo?.browser || 'Browser'})
                    </span>

                    <span className="flex items-center gap-1">
                      <Globe size={14} />
                      Langue : <strong>{selectedMessage.deviceInfo?.language?.toUpperCase() || 'FR'}</strong>
                    </span>

                    <span>
                      Écran : <strong>{selectedMessage.deviceInfo?.screen || 'N/A'}</strong>
                    </span>

                    <span>
                      Plateforme : <strong>{selectedMessage.deviceInfo?.platform || 'Web'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-5 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Message de l'utilisateur
                </h4>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Thread History & Replies */}
              {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                <div className="p-5 space-y-3 bg-gray-50/40 dark:bg-gray-850/30">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-emerald-500" />
                    Fil des Réponses ({selectedMessage.replies.length})
                  </h4>
                  <div className="space-y-2.5">
                    {selectedMessage.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                          reply.sender === 'admin'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 ml-4'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="flex items-center gap-1">
                            {reply.sender === 'admin' ? <Shield size={13} className="text-emerald-600" /> : <User size={13} />}
                            {reply.senderName} {reply.sender === 'admin' && '(Admin)'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-normal">
                            {new Date(reply.timestamp).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {reply.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Section */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <Send size={14} className="text-emerald-500" />
                    Répondre à {selectedMessage.userName}
                  </h4>
                </div>

                {/* Quick Templates */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Modèles :</span>
                  {quickTemplates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReplyText(tpl.text)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-[11px] text-gray-700 dark:text-gray-300 font-bold transition-colors cursor-pointer"
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>

                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Rédigez votre réponse ici. Elle sera visible directement dans l'application pour ${selectedMessage.userName}...`}
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3.5 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />

                {/* Reply Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleSendAppReply}
                      disabled={sendingReply || !replyText.trim()}
                      className={`px-4 py-2.5 rounded-xl font-black text-xs text-white flex items-center gap-2 transition-all cursor-pointer ${
                        sendingReply || !replyText.trim()
                          ? 'bg-gray-400 opacity-60 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-md'
                      }`}
                    >
                      {sendingReply ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={14} />
                          Envoyer Réponse dans l'App
                        </>
                      )}
                    </button>

                    <a
                      href={generateGmailReplyToUserUrl(selectedMessage, replyText, adminConfig.linkedGmail)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
                    >
                      <Mail size={14} />
                      Répondre via Gmail Lié
                      <ExternalLink size={11} />
                    </a>

                    <a
                      href={generateMailtoUrl(selectedMessage, adminConfig.linkedGmail)}
                      className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl transition-colors"
                    >
                      Mailto direct
                    </a>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
                    title="Supprimer ce message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center px-6">
              <Mail className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
              <h4 className="text-base font-black text-gray-700 dark:text-gray-300">
                Sélectionnez un message pour l'inspecter
              </h4>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Consultez le dossier complet de l'utilisateur, ses informations Premium, son environnement technique et répondez en 1 clic.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Linked Gmail Configuration Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl">
                    <Mail size={20} />
                  </div>
                  <h3 className="font-black text-gray-900 dark:text-white text-base">
                    Lier mon Compte Gmail
                  </h3>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Indiquez l'adresse Gmail où vous souhaitez recevoir et centraliser les notifications et dossiers complets des utilisateurs.
              </p>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Adresse Gmail de Réception
                  </label>
                  <input
                    type="email"
                    value={editGmailInput}
                    onChange={(e) => setEditGmailInput(e.target.value)}
                    placeholder="ex: jibriltengeh57@gmail.com"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Sparkles size={14} className="shrink-0" />
                  <span>
                    Chaque message envoyé contiendra le statut Premium/Standard, les points, l'appareil et le numéro de ticket.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={savingConfig || !editGmailInput.trim()}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {savingConfig ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save size={14} />
                        Enregistrer la liaison
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEmailSupportManager;
