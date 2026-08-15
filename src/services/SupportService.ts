import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  SupportMessage, 
  AdminSupportConfig, 
  SupportMessageReply, 
  SupportDeviceInfo, 
  SupportCategory, 
  SupportPriority, 
  SupportStatus 
} from '../types/support';

const LOCAL_STORAGE_MESSAGES_KEY = 'asrarhub_support_messages_cache';
const LOCAL_STORAGE_CONFIG_KEY = 'asrarhub_admin_support_config';

export const DEFAULT_ADMIN_GMAIL = 'jibriltengeh57@gmail.com';

export const DEFAULT_SUPPORT_CONFIG: AdminSupportConfig = {
  linkedGmail: DEFAULT_ADMIN_GMAIL,
  autoOpenGmailCompose: true,
  emailNotificationsEnabled: true,
  supportPhoneWhatsapp: '+221 77 000 00 00',
  autoReplyMessage: 'Assalam Alaykoum. Votre message a bien été transmis à la direction spirituelle AsrarHub. Nous vous répondrons dans les plus brefs délais.',
  updatedAt: Date.now()
};

/**
 * Detect client device information for support context
 */
export const captureDeviceInfo = (language: string = 'fr'): SupportDeviceInfo => {
  const ua = navigator.userAgent;
  let os = 'Inconnu';
  let browser = 'Inconnu';
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  if (/mobi/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/ipad|tablet/i.test(ua)) {
    deviceType = 'tablet';
  }

  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/linux/i.test(ua)) os = 'Linux';

  if (/chrome|crios/i.test(ua) && !/edge|edg/i.test(ua) && !/opr/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua) && !/chromium/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/edge|edg/i.test(ua)) browser = 'Edge';
  else if (/opr/i.test(ua) || /opera/i.test(ua)) browser = 'Opera';

  const screen = `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio || 1}x)`;
  const platform = (window as any).Capacitor ? 'Capacitor Mobile App' : 'Navigateur Web';

  return {
    os,
    browser,
    deviceType,
    screen,
    language,
    platform,
    isOnline: navigator.onLine,
    appVersion: '2.5.0'
  };
};

/**
 * Generates a unique readable ticket number
 */
export const generateTicketNumber = (): string => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `#ASR-${year}-${randomSuffix}`;
};

/**
 * Fetch or load admin support config
 */
export const getAdminSupportConfig = async (): Promise<AdminSupportConfig> => {
  try {
    const configDoc = await getDoc(doc(db, 'admin_settings', 'support_config'));
    if (configDoc.exists()) {
      const data = configDoc.data() as AdminSupportConfig;
      localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(data));
      return { ...DEFAULT_SUPPORT_CONFIG, ...data };
    }
  } catch (error) {
    console.warn('[SupportService] Could not fetch remote admin support config, using cached/default:', error);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return DEFAULT_SUPPORT_CONFIG;
};

/**
 * Save / update admin support config (e.g. linked Gmail)
 */
export const saveAdminSupportConfig = async (config: Partial<AdminSupportConfig>): Promise<AdminSupportConfig> => {
  const current = await getAdminSupportConfig();
  const updated: AdminSupportConfig = {
    ...current,
    ...config,
    updatedAt: Date.now()
  };

  localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(updated));

  try {
    await setDoc(doc(db, 'admin_settings', 'support_config'), updated, { merge: true });
  } catch (error) {
    console.warn('[SupportService] Error saving remote support config:', error);
  }

  return updated;
};

/**
 * Send a new support message from user to admin
 */
export const sendSupportMessage = async (params: {
  userId: string;
  userName: string;
  userEmail: string;
  userPhoto?: string | null;
  userPhone?: string;
  userCountry?: string;
  accountTier: 'free' | 'standard' | 'premium' | 'pro' | 'trial';
  isPremium: boolean;
  isTrialActive?: boolean;
  spiritualPoints?: number;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  message: string;
  deviceInfo: SupportDeviceInfo;
}): Promise<SupportMessage> => {
  const adminConfig = await getAdminSupportConfig();
  const ticketNumber = generateTicketNumber();
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const now = Date.now();

  const newMessage: SupportMessage = {
    id,
    ticketNumber,
    userId: params.userId || 'anonymous_user',
    userName: params.userName || 'Utilisateur Anonyme',
    userEmail: params.userEmail || 'non-renseigne@asrarhub.app',
    userPhoto: params.userPhoto,
    userPhone: params.userPhone,
    userCountry: params.userCountry,
    accountTier: params.accountTier,
    isPremium: params.isPremium,
    isTrialActive: params.isTrialActive,
    spiritualPoints: params.spiritualPoints || 0,
    subject: params.subject,
    category: params.category,
    priority: params.priority,
    message: params.message,
    deviceInfo: params.deviceInfo,
    createdAt: now,
    updatedAt: now,
    status: 'unread',
    emailDispatchedTo: adminConfig.linkedGmail || DEFAULT_ADMIN_GMAIL,
    replies: []
  };

  // 1. Save to local storage cache immediately
  try {
    const cachedList = getCachedSupportMessages();
    cachedList.unshift(newMessage);
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(cachedList));
  } catch (e) {
    console.error('Error caching support message:', e);
  }

  // 2. Save to Firestore
  try {
    await setDoc(doc(db, 'support_messages', id), newMessage);
  } catch (error) {
    console.warn('[SupportService] Failed writing to Firestore, saved to local cache:', error);
  }

  return newMessage;
};

/**
 * Retrieve cached support messages
 */
export const getCachedSupportMessages = (): SupportMessage[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Subscribe to all support messages in real-time (for Admin Dashboard)
 */
export const subscribeAllSupportMessages = (
  callback: (messages: SupportMessage[]) => void
): (() => void) => {
  // Return initial cache first
  const initialCache = getCachedSupportMessages();
  if (initialCache.length > 0) {
    callback(initialCache);
  }

  try {
    const q = query(collection(db, 'support_messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: SupportMessage[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as SupportMessage);
        });

        // Merge with local items if some haven't synced yet
        const localItems = getCachedSupportMessages();
        const mergedMap = new Map<string, SupportMessage>();
        list.forEach((item) => mergedMap.set(item.id, item));
        localItems.forEach((item) => {
          if (!mergedMap.has(item.id)) {
            mergedMap.set(item.id, item);
          }
        });

        const finalList = Array.from(mergedMap.values()).sort((a, b) => b.createdAt - a.createdAt);
        localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(finalList));
        callback(finalList);
      },
      (error) => {
        console.warn('[SupportService] Error subscribing to support messages:', error);
        callback(getCachedSupportMessages());
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('[SupportService] Failed setting onSnapshot for support messages:', e);
    return () => {};
  }
};

/**
 * Subscribe to current user's support messages (for User Profile)
 */
export const subscribeUserSupportMessages = (
  userId: string,
  callback: (messages: SupportMessage[]) => void
): (() => void) => {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const allCached = getCachedSupportMessages().filter((m) => m.userId === userId);
  callback(allCached);

  try {
    const q = query(
      collection(db, 'support_messages'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: SupportMessage[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as SupportMessage);
        });
        callback(list);
      },
      (error) => {
        console.warn('[SupportService] Error subscribing to user messages:', error);
        callback(getCachedSupportMessages().filter((m) => m.userId === userId));
      }
    );
    return unsubscribe;
  } catch (e) {
    return () => {};
  }
};

/**
 * Update message status (read, in_progress, resolved, archived)
 */
export const updateSupportMessageStatus = async (
  messageId: string,
  status: SupportStatus
): Promise<void> => {
  const localList = getCachedSupportMessages();
  const target = localList.find((m) => m.id === messageId);
  if (target) {
    target.status = status;
    target.updatedAt = Date.now();
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(localList));
  }

  try {
    await updateDoc(doc(db, 'support_messages', messageId), {
      status,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.warn('[SupportService] Error updating status in Firestore:', error);
  }
};

/**
 * Add an admin reply to a ticket
 */
export const addSupportMessageReply = async (
  messageId: string,
  reply: {
    sender: 'admin' | 'user';
    senderName: string;
    senderEmail?: string;
    message: string;
  }
): Promise<SupportMessageReply> => {
  const newReply: SupportMessageReply = {
    id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sender: reply.sender,
    senderName: reply.senderName,
    senderEmail: reply.senderEmail,
    message: reply.message,
    timestamp: Date.now()
  };

  const localList = getCachedSupportMessages();
  const target = localList.find((m) => m.id === messageId);
  if (target) {
    if (!target.replies) target.replies = [];
    target.replies.push(newReply);
    if (reply.sender === 'admin') {
      target.status = 'in_progress';
    }
    target.updatedAt = Date.now();
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(localList));
  }

  try {
    const docRef = doc(db, 'support_messages', messageId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const currentData = snap.data() as SupportMessage;
      const updatedReplies = [...(currentData.replies || []), newReply];
      await updateDoc(docRef, {
        replies: updatedReplies,
        status: reply.sender === 'admin' ? 'in_progress' : currentData.status,
        updatedAt: Date.now()
      });
    }
  } catch (error) {
    console.warn('[SupportService] Error adding reply to Firestore:', error);
  }

  return newReply;
};

/**
 * Delete a support message
 */
export const deleteSupportMessage = async (messageId: string): Promise<void> => {
  const localList = getCachedSupportMessages().filter((m) => m.id !== messageId);
  localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(localList));

  try {
    await deleteDoc(doc(db, 'support_messages', messageId));
  } catch (error) {
    console.warn('[SupportService] Error deleting message from Firestore:', error);
  }
};

/**
 * Format email body containing full user details and ticket context
 */
export const formatEmailSupportBody = (message: SupportMessage): string => {
  const dateFormatted = new Date(message.createdAt).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const tierBadge = message.isPremium 
    ? '⭐⭐⭐ MEMBRE PREMIUM ACTIF ⭐⭐⭐' 
    : message.accountTier === 'trial' 
      ? '⏳ ESSAI GRATUIT 24H ACTIF' 
      : '👤 COMPTE STANDARD / GRATUIT';

  return `══════════════════════════════════════════════════════
🕌 ASRARHUB - DOSSIER CONTACT & SUPPORT CLIENT
══════════════════════════════════════════════════════
📌 TICKET N°: ${message.ticketNumber}
📅 DATE D'ENVOI: ${dateFormatted}
⚡ PRIORITÉ: ${message.priority.toUpperCase()}
📂 CATÉGORIE: ${message.category.toUpperCase()}

──────────────────────────────────────────────────────
👤 INFORMATIONS UTILISATEUR / PROFIL
──────────────────────────────────────────────────────
• Nom: ${message.userName}
• Email: ${message.userEmail}
• Statut Compte: ${tierBadge}
• Points Spirituels: ${message.spiritualPoints || 0} pts
• Téléphone: ${message.userPhone || 'Non renseigné'}
• Pays: ${message.userCountry || 'Non renseigné'}
• UID Firebase: ${message.userId}

──────────────────────────────────────────────────────
📱 DIAGNOSTIC APPAREIL & ENVIRONNEMENT TECHNIQUE
──────────────────────────────────────────────────────
• Plateforme: ${message.deviceInfo?.platform || 'Web'}
• Appareil: ${message.deviceInfo?.deviceType || 'desktop'} (${message.deviceInfo?.os || 'OS inconnu'})
• Navigateur: ${message.deviceInfo?.browser || 'Inconnu'}
• Langue active: ${message.deviceInfo?.language?.toUpperCase() || 'FR'}
• Résolution Écran: ${message.deviceInfo?.screen || 'N/A'}
• Statut Réseau: ${message.deviceInfo?.isOnline ? 'En ligne (Online)' : 'Hors-ligne (Offline)'}
• Version App: ${message.deviceInfo?.appVersion || '2.5.0'}

══════════════════════════════════════════════════════
✉️ SUJET: ${message.subject}
══════════════════════════════════════════════════════
${message.message}

══════════════════════════════════════════════════════
📩 Message généré depuis l'application AsrarHub.
Pour répondre à l'utilisateur, écrivez directement à : ${message.userEmail}
══════════════════════════════════════════════════════`;
};

/**
 * Generate a direct web Gmail compose URL with pre-filled recipient, subject, and rich message body
 */
export const generateGmailComposeUrl = (message: SupportMessage, targetAdminEmail?: string): string => {
  const to = encodeURIComponent(targetAdminEmail || message.emailDispatchedTo || DEFAULT_ADMIN_GMAIL);
  const subjectPrefix = message.isPremium ? '[PREMIUM ⭐]' : '[STANDARD]';
  const subject = encodeURIComponent(`${subjectPrefix} Ticket ${message.ticketNumber} : ${message.subject}`);
  const body = encodeURIComponent(formatEmailSupportBody(message));

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
};

/**
 * Generate a Gmail reply URL from Admin to User
 */
export const generateGmailReplyToUserUrl = (
  message: SupportMessage, 
  replyText: string = '', 
  adminEmail?: string
): string => {
  const to = encodeURIComponent(message.userEmail);
  const subject = encodeURIComponent(`Re: [${message.ticketNumber}] ${message.subject} - Support AsrarHub`);
  
  const bodyContent = `Assalam Alaykoum ${message.userName},

${replyText ? replyText + '\n\n' : ''}Nous faisons suite à votre message (Ticket ${message.ticketNumber}) :
--------------------------------------------------
"${message.message}"
--------------------------------------------------

BarakAllahu Fik,
La Direction Spirituelle AsrarHub
Email : ${adminEmail || DEFAULT_ADMIN_GMAIL}`;

  const body = encodeURIComponent(bodyContent);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
};

/**
 * Generate a standard mailto: link
 */
export const generateMailtoUrl = (message: SupportMessage, targetAdminEmail?: string): string => {
  const to = targetAdminEmail || message.emailDispatchedTo || DEFAULT_ADMIN_GMAIL;
  const subjectPrefix = message.isPremium ? '[PREMIUM ⭐]' : '[STANDARD]';
  const subject = encodeURIComponent(`${subjectPrefix} Ticket ${message.ticketNumber} : ${message.subject}`);
  const body = encodeURIComponent(formatEmailSupportBody(message));

  return `mailto:${to}?subject=${subject}&body=${body}`;
};
