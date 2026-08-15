import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  X, 
  Mail, 
  Shield, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Smartphone, 
  Globe, 
  ChevronRight, 
  ExternalLink, 
  HelpCircle, 
  User, 
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  sendSupportMessage, 
  subscribeUserSupportMessages, 
  captureDeviceInfo, 
  generateGmailComposeUrl, 
  generateMailtoUrl, 
  getAdminSupportConfig 
} from '../services/SupportService';
import { 
  SupportMessage, 
  SupportCategory, 
  SupportPriority 
} from '../types/support';

interface FloatingSupportContactProps {
  isUserProfile?: boolean;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export const FloatingSupportContact: React.FC<FloatingSupportContactProps> = ({ 
  isUserProfile = false,
  onOpenStateChange 
}) => {
  const { user, isPremium, isTrialActive } = useAuth();
  const { language, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  const [userMessages, setUserMessages] = useState<SupportMessage[]>([]);
  const [adminGmail, setAdminGmail] = useState<string>('jibriltengeh57@gmail.com');

  // Form State
  const [category, setCategory] = useState<SupportCategory>('general');
  const [priority, setPriority] = useState<SupportPriority>('normal');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportMessage | null>(null);
  const [copiedTicketId, setCopiedTicketId] = useState(false);

  useEffect(() => {
    getAdminSupportConfig().then(cfg => {
      if (cfg?.linkedGmail) {
        setAdminGmail(cfg.linkedGmail);
      }
    });
  }, []);

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = subscribeUserSupportMessages(user.uid, (msgs) => {
        setUserMessages(msgs);
      });
      return () => unsubscribe();
    }
  }, [user?.uid]);

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
    if (onOpenStateChange) onOpenStateChange(open);
    if (open && submittedTicket) {
      setSubmittedTicket(null);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const deviceInfo = captureDeviceInfo(language);
      const tier = isPremium ? 'premium' : isTrialActive ? 'trial' : 'standard';

      const created = await sendSupportMessage({
        userId: user?.uid || 'anonymous_guest',
        userName: user?.name || user?.email?.split('@')[0] || 'Utilisateur AsrarHub',
        userEmail: user?.email || 'visiteur@asrarhub.app',
        userPhoto: user?.photoURL || null,
        userPhone: userPhone.trim() || user?.phone || undefined,
        userCountry: user?.country || undefined,
        accountTier: tier,
        isPremium: !!isPremium,
        isTrialActive: !!isTrialActive,
        spiritualPoints: user?.spiritualPoints || 0,
        subject: subject.trim(),
        category,
        priority,
        message: message.trim(),
        deviceInfo
      });

      setSubmittedTicket(created);
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Failed to send support message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTicketId(true);
    setTimeout(() => setCopiedTicketId(false), 2000);
  };

  const unreadRepliesCount = userMessages.reduce((acc, m) => {
    const hasAdminReply = m.replies && m.replies.some(r => r.sender === 'admin');
    return acc + (hasAdminReply && m.status !== 'resolved' ? 1 : 0);
  }, 0);

  return (
    <>
      {/* Floating Action Button */}
      <div className={`fixed z-40 ${isUserProfile ? 'bottom-6 right-6 sm:bottom-8 sm:right-8' : 'bottom-20 right-4 sm:bottom-6 sm:right-6'}`}>
        <motion.button
          id="btn-floating-support-contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleToggle(true)}
          className={`flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all cursor-pointer border ${
            isPremium
              ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white border-amber-300/40 shadow-amber-500/20'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-400/30 shadow-emerald-600/30'
          }`}
          title={t('supportModal.fabTitle', "Contacter l'Administrateur")}
        >
          <div className="relative">
            <MessageSquare size={20} className="shrink-0" />
            {unreadRepliesCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadRepliesCount}
              </span>
            )}
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-wide flex items-center gap-1.5">
            <span>{t('supportModal.fabText', 'Contact Admin')}</span>
            {isPremium && <Crown size={14} className="text-amber-200 animate-bounce" />}
          </span>
        </motion.button>
      </div>

      {/* Contact & Support Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-50 via-emerald-50/30 to-amber-50/20 dark:from-gray-800/80 dark:via-gray-800 dark:to-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${
                    isPremium 
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400' 
                      : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-gray-900 dark:text-white text-base sm:text-lg">
                        {t('supportModal.headerTitle', "Contacter l'Administrateur")}
                      </h3>
                      {isPremium ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Crown size={10} /> {t('supportModal.vipSupport', 'Support VIP')}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {t('supportModal.support', 'Support')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('supportModal.headerSubtitle', "Liaison directe avec l'équipe spirituelle & Gmail")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(false)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 px-4 sm:px-6 gap-4">
                <button
                  type="button"
                  onClick={() => { setActiveTab('compose'); setSubmittedTicket(null); }}
                  className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'compose'
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Send size={15} />
                  <span>{t('supportModal.tabCompose', 'Rédiger un Message')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'history'
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Clock size={15} />
                  <span>{t('supportModal.tabHistory', 'Mes Messages ({count})', { count: userMessages.length })}</span>
                  {unreadRepliesCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {submittedTicket ? (
                  /* Success Screen */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 sm:py-8 space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 size={36} />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-gray-900 dark:text-white">
                        {t('supportModal.successTitle', 'Message Transmis avec Succès !')}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        {t('supportModal.successDesc', "Votre demande et l'intégralité de vos informations ont été transmises à l'administrateur.")}
                      </p>
                    </div>

                    {/* Ticket Code Card */}
                    <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-sm mx-auto flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {t('supportModal.ticketRef', 'Référence Ticket')}
                        </span>
                        <p className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                          {submittedTicket.ticketNumber}
                        </p>
                      </div>
                      <button
                        onClick={() => copyTicketCode(submittedTicket.ticketNumber)}
                        className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
                      >
                        {copiedTicketId ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        {copiedTicketId ? t('supportModal.copied', 'Copié') : t('supportModal.copy', 'Copier')}
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto">
                      <a
                        href={generateGmailComposeUrl(submittedTicket, adminGmail)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <Mail size={15} />
                        {t('supportModal.openGmail', 'Ouvrir dans Gmail ({email})', { email: adminGmail })}
                        <ExternalLink size={12} />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittedTicket(null);
                          setActiveTab('history');
                        }}
                        className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl transition-colors"
                      >
                        {t('supportModal.viewMyMessages', 'Voir mes messages')}
                      </button>
                    </div>
                  </motion.div>
                ) : activeTab === 'compose' ? (
                  /* Compose Form */
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    {/* User info summary banner */}
                    <div className="p-3.5 bg-gradient-to-r from-emerald-50/60 via-gray-50 to-amber-50/40 dark:from-gray-800 dark:to-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 uppercase">
                          {user?.name?.[0] || user?.email?.[0] || 'U'}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-gray-900 dark:text-white truncate">
                            {user?.name || user?.email || t('supportModal.visitor', 'Visiteur')}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                            {user?.email || t('supportModal.notConnected', 'Non connecté')}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isPremium ? (
                          <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-black text-[10px] rounded-full border border-amber-300/40 flex items-center gap-1">
                            <Crown size={12} /> {t('supportModal.premiumAccount', 'Compte Premium')}
                          </span>
                        ) : isTrialActive ? (
                          <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-[10px] rounded-full border border-blue-300/40">
                            {t('supportModal.trialActive', '⏳ Essai 24h Actif')}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-[10px] rounded-full">
                            👤 {t('supportModal.standardAccount', 'Compte Standard')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category & Priority Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                          {t('supportModal.categoryLabel', 'Type de demande / Objet')}
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as SupportCategory)}
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                          <option value="general">{t('supportModal.catGeneral', 'Assistance Générale')}</option>
                          <option value="spiritual_guidance">{t('supportModal.catSpiritual', 'Guidance & Conseils Spirituels')}</option>
                          <option value="premium_issue">{t('supportModal.catPremium', 'Abonnement & Accès Premium')}</option>
                          <option value="payment_support">{t('supportModal.catPayment', 'Paiement / Boutique / Paystack')}</option>
                          <option value="custom_khatim">{t('supportModal.catKhatim', 'Demande de Wafq / Khatim Spécifique')}</option>
                          <option value="technical_bug">{t('supportModal.catBug', 'Problème Technique / Bug')}</option>
                          <option value="suggestion">{t('supportModal.catSuggestion', "Suggestion d'Amélioration")}</option>
                          <option value="other">{t('supportModal.catOther', 'Autre demande')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                          {t('supportModal.priorityLabel', "Niveau d'Urgence")}
                        </label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as SupportPriority)}
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                          <option value="normal">{t('supportModal.prioNormal', '🟢 Normale (24h-48h)')}</option>
                          <option value="high">{t('supportModal.prioHigh', '🟡 Haute (Prioritaire)')}</option>
                          <option value="urgent">{t('supportModal.prioUrgent', '🔴 Urgente (Immédiate)')}</option>
                        </select>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        {t('supportModal.subjectLabel', 'Titre du Message')}
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={t('supportModal.subjectPlaceholder', 'Ex: Question sur le calcul Abjad, Activation Premium...')}
                        required
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    {/* Phone (optional) */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex justify-between">
                        <span>{t('supportModal.phoneLabel', 'Numéro WhatsApp / Téléphone (Optionnel)')}</span>
                        <span className="text-gray-400 font-normal">{t('supportModal.phoneSub', 'Pour suivi rapide')}</span>
                      </label>
                      <input
                        type="tel"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder={t('supportModal.phonePlaceholder', 'Ex: +221 77 000 00 00')}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    {/* Message Body */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex justify-between">
                        <span>{t('supportModal.messageLabel', 'Votre Message détaillé')}</span>
                        <span className="text-[11px] text-gray-400">{message.length}/1500</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('supportModal.messagePlaceholder', 'Écrivez votre message ici... Décrivez votre besoin ou votre question avec précision.')}
                        rows={5}
                        maxLength={1500}
                        required
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                      />
                    </div>

                    {/* Auto-included Diagnostic badge */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Shield size={14} className="text-emerald-500 shrink-0" />
                      <span>
                        {t('supportModal.diagnosticNote', "Vos informations système (appareil, statut de compte, version) seront automatiquement transmises à l'admin pour faciliter l'assistance.")}
                      </span>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || !subject.trim() || !message.trim()}
                        className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                          isSubmitting || !subject.trim() || !message.trim()
                            ? 'bg-gray-400 cursor-not-allowed opacity-60'
                            : isPremium
                              ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-600/20'
                              : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send size={16} />
                            <span>{t('supportModal.sendBtn', "Envoyer le Message à l'Admin")}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* History Tab */
                  <div className="space-y-3">
                    {userMessages.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <MessageSquare className="mx-auto text-gray-300 dark:text-gray-600 mb-2" size={36} />
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          {t('supportModal.noMessagesTitle', 'Aucun message envoyé pour le moment')}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {t('supportModal.noMessagesDesc', "Vos futurs tickets et les réponses de l'administrateur apparaîtront ici.")}
                        </p>
                        <button
                          onClick={() => setActiveTab('compose')}
                          className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                          {t('supportModal.composeBtn', "Écrire à l'administrateur")}
                        </button>
                      </div>
                    ) : (
                      userMessages.map((msg) => {
                        const statusColors = {
                          unread: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
                          read: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
                          in_progress: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
                          resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
                          archived: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        };

                        const statusLabels = {
                          unread: t('supportModal.statusUnread', 'En attente de lecture'),
                          read: t('supportModal.statusRead', "Lu par l'admin"),
                          in_progress: t('supportModal.statusInProgress', 'En cours de traitement'),
                          resolved: t('supportModal.statusResolved', 'Résolu'),
                          archived: t('supportModal.statusArchived', 'Archivé')
                        };

                        return (
                          <div
                            key={msg.id}
                            className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3"
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                                  {msg.ticketNumber}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[msg.status]}`}>
                                  {statusLabels[msg.status]}
                                </span>
                              </div>
                              <span className="text-[11px] text-gray-400">
                                {new Date(msg.createdAt).toLocaleDateString(language === 'ha' ? 'ha-NG' : language === 'en' ? 'en-US' : 'fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            <div>
                              <h5 className="font-bold text-gray-900 dark:text-white text-sm">
                                {msg.subject}
                              </h5>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed whitespace-pre-wrap">
                                {msg.message}
                              </p>
                            </div>

                            {/* Replies Thread */}
                            {msg.replies && msg.replies.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                  {t('supportModal.adminReplies', "Réponses de l'Administration ({count}) :", { count: msg.replies.length })}
                                </p>
                                {msg.replies.map((reply) => (
                                  <div
                                    key={reply.id}
                                    className={`p-3 rounded-xl text-xs ${
                                      reply.sender === 'admin'
                                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200'
                                        : 'bg-gray-50 dark:bg-gray-750 text-gray-800 dark:text-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-bold flex items-center gap-1">
                                        {reply.sender === 'admin' && <Shield size={12} className="text-emerald-600" />}
                                        {reply.senderName}
                                      </span>
                                      <span className="text-[10px] text-gray-400">
                                        {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <p className="whitespace-pre-wrap leading-relaxed">
                                      {reply.message}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Quick Gmail link */}
                            <div className="pt-1 flex items-center justify-end">
                              <a
                                href={generateGmailComposeUrl(msg, adminGmail)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] font-bold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1"
                              >
                                <Mail size={12} />
                                {t('supportModal.replyViaGmail', 'Relancer par Gmail')}
                                <ExternalLink size={10} />
                              </a>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3.5 bg-gray-50 dark:bg-gray-850 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Globe size={13} />
                  <span>{t('supportModal.linkedEmail', 'Email lié :')} <strong className="text-gray-700 dark:text-gray-300">{adminGmail}</strong></span>
                </span>
                <span className="text-[11px]">{t('supportModal.version', 'AsrarHub Support v2.5')}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingSupportContact;
