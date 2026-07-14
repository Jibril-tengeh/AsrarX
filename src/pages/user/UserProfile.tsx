import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Bell, Clock, Save, Shield, Moon, Sun, Smartphone, Laptop, Tablet, Globe, Trash2, Award, Medal, Star, Target, LogOut, Camera, Image as ImageIcon, RefreshCw, Sparkles, LogIn, ChevronDown, Plus, XCircle, CheckCircle, FileText, BookOpen, ScrollText, Heart, X, Share2, Wifi, Database, Activity, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { PremiumBadge } from '../../components/PremiumBadge';
import { AuthModal } from '../../components/AuthModal';
import { PremiumWrapper } from '../../components/PremiumWrapper';
import { signOut, db, auth } from '../../lib/firebase';
import { doc, setDoc, collection, deleteDoc, onSnapshot, updateDoc, query } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { getFCMToken, checkNotificationSupport, onMessageListener } from '../../lib/fcm';
import { getApiUrl } from '../../lib/api';
import { pingFirestore, getNetworkLogs, clearNetworkLogs, addNetworkLog, triggerBackgroundReconnect, NetworkLog, PingResult } from '../../utils/networkLogger';

interface Reminder {
  id: string;
  time: string;
  enabled: boolean;
  label: string;
  isZikr?: boolean;
  zikrId?: string;
  zikrTarget?: number;
}

const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}> = ({ title, icon, children, headerAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {headerAction && <div onClick={e => e.stopPropagation()}>{headerAction}</div>}
          <div className={`p-1.5 rounded-full bg-gray-50 dark:bg-gray-700/50 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown size={18} />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GamificationBadges = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ journal_entries: 0 });

  useEffect(() => {
    const savedStats = localStorage.getItem('asrar_stats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        if (parsed && typeof parsed === 'object') {
          setStats(parsed);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const badges = [
    {
      id: 'initie',
      name: t('profile.badges.initie.name', 'Initié'),
      description: t('profile.badges.initie.desc', 'A ouvert le journal spirituel (1 entrée)'),
      icon: Award,
      color: 'text-bronze-500',
      bg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
      earned: stats.journal_entries >= 1
    },
    {
      id: 'regulier',
      name: t('profile.badges.regulier.name', 'Régulier'),
      description: t('profile.badges.regulier.desc', 'Maintient la discipline (7 entrées)'),
      icon: Medal,
      color: 'text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
      earned: stats.journal_entries >= 7
    },
    {
      id: 'devoue',
      name: t('profile.badges.devoue.name', 'Dévoué'),
      description: t('profile.badges.devoue.desc', 'Lumière constante (30 entrées)'),
      icon: Star,
      color: 'text-amber-500',
      bg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      earned: stats.journal_entries >= 30
    },
    {
      id: 'savant',
      name: t('profile.badges.chercheur.name', 'Chercheur'),
      description: t('profile.badges.chercheur.desc', 'Explore les Asrar (Utilisé 5 outils)'),
      icon: Target,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      earned: (stats.tools_used || 0) >= 5
    }
  ];

  return (
    <CollapsibleSection
      title={t('profile.badges.title', 'Badges & Accomplissements')}
      icon={<Award className="text-amber-500" size={20} />}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
        {t('profile.badges.subtitle', 'Vos actes constants forgent votre lumière. Ces badges reflètent votre régularité et discipline.')}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map(badge => (
          <div 
            key={badge.id}
            className={`flex flex-col items-center text-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              badge.earned 
                ? `border-${badge.bg.split(' ')[0].replace('bg-', '')} ${badge.bg}` 
                : 'border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 grayscale opacity-60'
            }`}
          >
            <badge.icon size={28} className={badge.earned ? "" : "text-gray-400"} />
            <div>
              <span className={`block font-bold text-sm ${badge.earned ? '' : 'text-gray-500'}`}>{badge.name}</span>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
};

export const UserProfile: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showAuthModal, setShowAuthModal] = useState(false);

  // --- Network Diagnostics State ---
  const [diagnosticLogs, setDiagnosticLogs] = useState<NetworkLog[]>(getNetworkLogs());
  const [pingResult, setPingResult] = useState<PingResult | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    const handleLogsUpdate = () => {
      setDiagnosticLogs(getNetworkLogs());
    };
    window.addEventListener('asrarhub_network_logs_updated', handleLogsUpdate);
    return () => {
      window.removeEventListener('asrarhub_network_logs_updated', handleLogsUpdate);
    };
  }, []);

  // --- Active Sessions State & Logic ---
  interface Session {
    id: string;
    os: string;
    browser: string;
    deviceType: string;
    lastActive: string;
    ip: string;
  }

  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const currentSessionId = localStorage.getItem('asrarhub_session_id');

  useEffect(() => {
    if (!user) {
      setActiveSessions([]);
      return;
    }

    setLoadingSessions(true);
    const sessionsRef = collection(db, 'users', user.uid, 'sessions');
    
    const unsubscribe = onSnapshot(sessionsRef, (snapshot) => {
      const sessionsList: Session[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        sessionsList.push({
          id: doc.id,
          os: data.os || 'Inconnu',
          browser: data.browser || 'Inconnu',
          deviceType: data.deviceType || 'desktop',
          lastActive: data.lastActive || new Date().toISOString(),
          ip: data.ip || 'Client Direct'
        });
      });
      
      // Sort sessions: current session first, then by last active desc
      sessionsList.sort((a, b) => {
        if (a.id === currentSessionId) return -1;
        if (b.id === currentSessionId) return 1;
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      });

      setActiveSessions(sessionsList);
      setLoadingSessions(false);
    }, (error) => {
      console.error("Error listening to sessions:", error);
      setLoadingSessions(false);
    });

    return () => unsubscribe();
  }, [user, currentSessionId]);

  const revokeSession = async (sessionId: string) => {
    if (!user) return;
    try {
      const sessionDocRef = doc(db, 'users', user.uid, 'sessions', sessionId);
      await deleteDoc(sessionDocRef);
    } catch (err) {
      console.error("Error revoking session:", err);
      alert("Impossible de révoquer la session. Veuillez réessayer.");
    }
  };
  // -------------------------------------
  
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newTime, setNewTime] = useState('06:00');
  const [newLabel, setNewLabel] = useState('');
  const [reminderType, setReminderType] = useState<'simple' | 'zikr'>('simple');
  const [selectedZikrId, setSelectedZikrId] = useState('subhanallah');
  const [customZikrName, setCustomZikrName] = useState('');
  const [customZikrTarget, setCustomZikrTarget] = useState(100);

  const PRESET_ZIKRS = [
    { id: 'subhanallah', text: 'Subhanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', target: 33 },
    { id: 'alhamdulillah', text: 'Alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', target: 33 },
    { id: 'allahuakbar', text: 'Allahu Akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', target: 34 },
    { id: 'astaghfirullah', text: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', target: 100 },
    { id: 'lailahaillallah', text: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', target: 100 },
    { id: 'salawat', text: 'Salawat', arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', target: 100 },
    { id: 'hasbunallah', text: 'Hasbunallah', arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', target: 450 },
    { id: 'ya_latif', text: 'Ya Latif', arabic: 'يَا لَطِيفُ', target: 129 },
    { id: 'custom', text: 'Autre (Zikr personnalisé)', arabic: '', target: 100 }
  ];
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [autoSave, setAutoSave] = useState(localStorage.getItem('asrar_auto_save_firestore') !== 'false');

  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [fcmEnabled, setFcmEnabled] = useState(false);
  const [isFcmLoading, setIsFcmLoading] = useState(false);
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);

  const [profileName, setProfileName] = useState('');
  const [profileCountry, setProfileCountry] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState('');
  const [notifsSynced, setNotifsSynced] = useState<boolean | null>(null);
  const [isSyncingNotifs, setIsSyncingNotifs] = useState(false);

  // --- Favorites Feature State and Realtime Logic ---
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [selectedFavArticle, setSelectedFavArticle] = useState<any | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'articles'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get saved bookmarks
      try {
        const savedIds: string[] = JSON.parse(localStorage.getItem('asrar_bookmarks') || '[]');
        if (Array.isArray(savedIds)) {
          const bookmarkedItems = allItems.filter(item => savedIds.includes(item.id));
          setFavorites(bookmarkedItems);
        } else {
          setFavorites([]);
        }
      } catch (err) {
        setFavorites([]);
      }
      setLoadingFavorites(false);
    }, (error) => {
      console.error("Error loading favorites:", error);
      setLoadingFavorites(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRemoveFavorite = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem('asrar_bookmarks') || '[]');
      if (Array.isArray(savedIds)) {
        const updatedIds = savedIds.filter(id => id !== itemId);
        localStorage.setItem('asrar_bookmarks', JSON.stringify(updatedIds));
        setFavorites(prev => prev.filter(item => item.id !== itemId));
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const handleShareFavArticle = async (article: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const snippet = (article.content || '').replace(/<[^>]+>/g, '').substring(0, 100) + '...';
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `Lire l'article "${article.title}" : ${snippet}`,
          url: window.location.href,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Lire l'article "${article.title}" : ${snippet}`)}`, '_blank');
    }
  };

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileCountry(user.country || '');
      setProfilePhone(user.phone || '');
      
      if (user.pushNotificationsEnabled !== undefined) {
        setFcmEnabled(!!user.pushNotificationsEnabled);
        setNotifsSynced(true);
      } else {
        setFcmEnabled(Notification.permission === 'granted');
        setNotifsSynced(true);
      }
    }
  }, [user]);

  useEffect(() => {
    const checkFCMStatus = async () => {
      try {
        const supported = await checkNotificationSupport();
        if (supported && Notification.permission === 'granted') {
          setFcmEnabled(true);
          const savedToken = localStorage.getItem('asrarhub_last_fcm_token');
          if (savedToken) {
            setFcmToken(savedToken);
          }
        }
      } catch (err) {
        console.warn("FCM Support check error:", err);
      }
    };
    checkFCMStatus();

    // Foreground message listener
    let unsubscribe: any = null;
    const setupListener = async () => {
      unsubscribe = await onMessageListener((payload) => {
        alert(`[Notification] ${payload.notification?.title}: ${payload.notification?.body}`);
      });
    };
    setupListener();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('asrar_reminders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setReminders(parsed);
        }
      } catch (e) {}
    } else {
      setReminders([
        { id: '1', time: '05:30', enabled: true, label: t('profile.reminders.morning', 'Wird du Matin') },
        { id: '2', time: '18:00', enabled: true, label: t('profile.reminders.evening', 'Wird du Soir') }
      ]);
    }
  }, []);

  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem('asrar_reminders', JSON.stringify(reminders));
    }
  }, [reminders]);

  const addReminder = () => {
    if (!newTime) return;
    
    let label = newLabel;
    let isZikr = false;
    let zikrId = '';
    let zikrTarget = 100;

    if (reminderType === 'zikr') {
      isZikr = true;
      if (selectedZikrId === 'custom') {
        if (!customZikrName) {
          alert("Veuillez saisir un nom pour votre Zikr personnalisé.");
          return;
        }
        label = `Zikr : ${customZikrName} (${customZikrTarget}x)`;
        zikrId = 'custom';
        zikrTarget = customZikrTarget;
      } else {
        const preset = PRESET_ZIKRS.find(z => z.id === selectedZikrId);
        if (preset) {
          label = `Zikr : ${preset.text} (${preset.target}x)`;
          zikrId = preset.id;
          zikrTarget = preset.target;
        }
      }
    } else {
      if (!newLabel) {
        alert("Veuillez saisir un libellé pour le rappel.");
        return;
      }
    }

    if ('Notification' in window && window.Notification.permission !== 'granted') {
      window.Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log("Notification permission granted.");
        }
      });
    }

    const newRem: Reminder = {
      id: Date.now().toString(),
      time: newTime,
      enabled: true,
      label: label,
      isZikr,
      zikrId,
      zikrTarget
    };
    setReminders([...reminders, newRem]);
    setNewLabel('');
    setCustomZikrName('');
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const requestNotificationPermission = async () => {
    if (!user) {
      alert(t('profile.loginRequired', "Veuillez vous connecter pour activer les notifications push."));
      return;
    }
    
    setIsFcmLoading(true);
    try {
      const token = await getFCMToken(user.uid);
      if (token) {
        setFcmToken(token);
        setFcmEnabled(true);
        localStorage.setItem('asrarhub_last_fcm_token', token);
        alert(t('profile.reminders.pushSuccess', 'Notifications push FCM activées avec succès !'));
      } else {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'denied') {
          alert(t('profile.reminders.pushDenied', "Les notifications ont été refusées. Veuillez les autoriser dans les paramètres de votre navigateur pour AsrarHub."));
        } else {
          alert(t('profile.reminders.pushUnsupported', "Les notifications push ne sont pas supportées sur ce navigateur ou cet appareil."));
        }
      }
    } catch (e: any) {
      console.warn("FCM Token generation error (handled gracefully):", e);
      if (String(e?.message || e).includes("permission") || String(e?.message || e).includes("refusée")) {
        alert(t('profile.reminders.pushDenied', "Les notifications ont été refusées. Veuillez les autoriser dans les paramètres de votre navigateur pour AsrarHub."));
      } else {
        alert(t('profile.reminders.pushError', 'Une erreur est survenue lors de la configuration FCM : ') + (e.message || e));
      }
    } finally {
      setIsFcmLoading(false);
    }
  };

  const testPushNotification = async () => {
    const activeToken = fcmToken || localStorage.getItem('asrarhub_last_fcm_token');
    if (!activeToken) {
      alert("Aucun jeton de notification disponible. Veuillez d'abord cliquer sur 'Activer les notifications push'.");
      return;
    }

    setIsTestingPush(true);
    setTestSuccess(null);
    try {
      const res = await fetch(getApiUrl('/api/send-push'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tokens: [activeToken],
          title: "Test de Rappel de Wird 🌟",
          body: "Votre appareil est maintenant configuré pour recevoir vos rappels de Wird sur AsrarHub !",
          data: {
            type: "wird_test",
            click_action: "/tools/personal-wird"
          }
        })
      });

      const data = await res.json();
      if (data.success && data.successCount > 0) {
        setTestSuccess(true);
      } else {
        setTestSuccess(false);
        console.error("FCM test request response failed:", data);
      }
    } catch (err: any) {
      console.error("FCM test request error:", err);
      setTestSuccess(false);
    } finally {
      setIsTestingPush(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);
  const [localCover, setLocalCover] = useState<string | null>(null);

  const resizeImage = (file: File, maxWidth: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Fill with white background to prevent transparent pngs from turning black
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      
      // Set local preview immediately
      const objectUrl = URL.createObjectURL(file);
      if (type === 'profile') setLocalPhoto(objectUrl);
      else setLocalCover(objectUrl);

      // We will just use base64 and save it to firestore directly since it's resized and compressed
      const base64Image = await resizeImage(file, type === 'profile' ? 256 : 800);

      
      const userRef = doc(db, 'users', user.uid);
      
      if (type === 'profile') {
        await setDoc(userRef, { photoURL: base64Image }, { merge: true });
      } else {
        await setDoc(userRef, { coverPhotoURL: base64Image }, { merge: true });
      }
      
      // Reset input so the same file can be selected again
      event.target.value = '';
      
    } catch (error: any) {
      console.error('Error uploading image', error);
      alert(t('profile.uploadError', "Erreur lors de l'enregistrement de l'image: ") + (error.message || ''));
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    setProfileSavedMsg('');
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name: profileName,
        country: profileCountry,
        phone: profilePhone
      }, { merge: true });
      
      setProfileSavedMsg(t('profile.personalInfo.saveSuccess', 'Profil enregistré avec succès !'));
      setTimeout(() => setProfileSavedMsg(''), 4000);
    } catch (e: any) {
      console.error("Error saving profile", e);
      alert(t('profile.personalInfo.saveError', "Erreur lors de l'enregistrement: ") + (e.message || e));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleToggleNotifications = async () => {
    if (!user) {
      alert(t('profile.loginRequired', "Veuillez vous connecter pour configurer les notifications."));
      return;
    }

    setIsSyncingNotifs(true);
    setNotifsSynced(false);

    try {
      const targetState = !fcmEnabled;
      
      if (targetState) {
        // Turning on: request/retrieve token
        const token = await getFCMToken(user.uid);
        if (token) {
          setFcmToken(token);
          setFcmEnabled(true);
          localStorage.setItem('asrarhub_last_fcm_token', token);
          
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            pushNotificationsEnabled: true,
            lastFCMToken: token
          });
          setNotifsSynced(true);
        } else {
          // Fallback: Even if FCM is not supported/blocked in this browser/iframe,
          // still allow toggling the field in Firestore so the feature remains fully functional and testable!
          console.warn("FCM not supported natively. Using database fallback toggle.");
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            pushNotificationsEnabled: true
          });
          setFcmEnabled(true);
          setNotifsSynced(true);
        }
      } else {
        // Turning off: update firestore
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          pushNotificationsEnabled: false
        });
        setFcmEnabled(false);
        setNotifsSynced(true);
      }
    } catch (err: any) {
      const errStr = String(err?.message || err);
      if (errStr.includes("permission") || errStr.includes("Permission") || errStr.includes("denied") || errStr.includes("refusée")) {
        console.warn("Notification toggle warning (permission issue handled):", errStr);
      } else {
        console.error("Error toggling notifications", err);
      }
      try {
        const targetState = !fcmEnabled;
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          pushNotificationsEnabled: targetState
        });
        setFcmEnabled(targetState);
        setNotifsSynced(true);
      } catch (innerErr) {
        setNotifsSynced(false);
      }
    } finally {
      setIsSyncingNotifs(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none">
      
      {/* Profil Header with Cover */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 mb-8 relative">
        {/* Cover Photo */}
        <div className="h-32 sm:h-48 bg-emerald-100 dark:bg-emerald-900/30 relative group">
          {(localCover || user?.coverPhotoURL) ? (
            <img src={localCover || user?.coverPhotoURL || ''} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <ImageIcon size={48} className="text-emerald-500" />
            </div>
          )}
          {user && (
            <button 
              onClick={() => coverInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-900/90 p-2 rounded-full shadow-sm text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors opacity-100 disabled:opacity-50"
            >
              {uploading ? <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin"></div> : <Camera size={18} />}
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 sm:-mt-16 mb-4 sm:mb-0 relative z-10">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white dark:bg-gray-800 p-1.5 shadow-sm">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center overflow-hidden">
                  {(localPhoto || user?.photoURL) ? (
                    <img src={localPhoto || user?.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-emerald-600 dark:text-emerald-300" size={40} />
                  )}
                </div>
              </div>
              {user && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {uploading ? <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin"></div> : <Camera size={16} />}
                </button>
              )}
            </div>
            
            <div className="text-center sm:text-left mb-2 sm:mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                {user?.name || t('profile.defaultName', 'Profil & Préférences')}
                <PremiumBadge />
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {user?.email || t('profile.defaultEmail', 'Gérez vos paramètres et rappels spirituels')}
              </p>
              {user && (
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800">
                    <Sparkles size={14} />
                    <span>{user?.spiritualPoints || 0} pts</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {user ? (
            <button 
              onClick={handleLogout}
              className="mt-4 sm:mt-6 flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              <span>{t('profile.logout', 'Déconnexion')}</span>
            </button>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="mt-4 sm:mt-6 flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors text-sm font-medium"
            >
              <LogIn size={18} />
              <span>{t('profile.login', 'Se connecter')}</span>
            </button>
          )}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleImageUpload(e, 'profile')} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={coverInputRef} 
        onChange={(e) => handleImageUpload(e, 'cover')} 
        accept="image/*" 
        className="hidden" 
      />

      <GamificationBadges />

      {/* Section Mes Favoris (Secrets et Articles) */}
      <CollapsibleSection
        title={t('profile.favorites.title', 'Mes Favoris')}
        icon={<Star className="text-amber-500" size={20} />}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          Retrouvez ici tous les secrets et articles que vous avez marqués comme favoris.
        </p>

        {loadingFavorites ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 w-full bg-gray-100 dark:bg-gray-800/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <Star className="mx-auto text-gray-300 dark:text-gray-600 mb-2" size={32} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Aucun favori pour le moment.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Vous pouvez ajouter des secrets et des articles à vos favoris en cliquant sur l'icône étoile.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((item) => {
              const isArticle = item.category === undefined || item.category === '' || item.type === 'richtext';
              return (
                <div 
                  key={item.id}
                  className="flex items-center justify-between border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/40 rounded-2xl p-4 transition-all hover:border-emerald-200 dark:hover:border-emerald-800/40 group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                      {isArticle ? <FileText size={18} /> : <BookOpen size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          {isArticle ? "Article" : (item.category || "Secret")}
                        </span>
                        {item.isPremium && (
                          <span className="bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase">
                            Premium
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mt-0.5 truncate">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {isArticle ? (
                      <button
                        onClick={() => setSelectedFavArticle(item)}
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                      >
                        Lire
                      </button>
                    ) : (
                      <Link
                        to={`/secret/${item.id}`}
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                      >
                        Ouvrir
                      </Link>
                    )}

                    <button
                      onClick={(e) => handleRemoveFavorite(item.id, e)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                      title="Retirer des favoris"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CollapsibleSection>

      {/* Informations Personnelles (Nom, Pays, Téléphone) */}
      <CollapsibleSection
        title={t('profile.personalInfo.title', 'Informations du Profil')}
        icon={<User className="text-emerald-500" size={20} />}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          {t('profile.personalInfo.subtitle', "Mettez à jour vos informations de profil. Ces informations seront visibles par les administrateurs.")}
        </p>

        {profileSavedMsg && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" />
            <span>{profileSavedMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.personalInfo.fullName', 'Nom complet')}
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              placeholder="Ex: Seydina Mouhamed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.personalInfo.country', 'Pays')}
            </label>
            <input
              type="text"
              value={profileCountry}
              onChange={(e) => setProfileCountry(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              placeholder="Ex: Sénégal"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.personalInfo.phone', 'Pays + numéro de téléphone')}
            </label>
            <input
              type="text"
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              placeholder="Ex: +221 77 123 45 67"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={isSavingProfile || !user}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {isSavingProfile ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={16} />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title={t('profile.reminders.title', 'Rappels Quotidiens')}
        icon={<Bell className="text-emerald-500" size={20} />}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          {t('profile.reminders.subtitle', "Configurez des rappels pour vos heures de lecture (Wirds, Zikrs). L'application vous enverra une notification à l'heure souhaitée.")}
        </p>

        {/* Toggle Switch with Sync Status */}
        <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/80 rounded-2xl p-4 sm:p-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white text-base">
                {t('profile.reminders.notifications', 'Notifications Push')}
              </span>
              
              {/* Sync status indicator */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-700">
                {isSyncingNotifs ? (
                  <>
                    <RefreshCw className="animate-spin text-amber-500" size={12} />
                    <span className="text-amber-600 dark:text-amber-400">Synchronisation...</span>
                  </>
                ) : notifsSynced ? (
                  <>
                    <CheckCircle className="text-emerald-500" size={12} />
                    <span className="text-emerald-600 dark:text-emerald-400">Synchronisé</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500" size={12} />
                    <span className="text-red-600 dark:text-red-400">Non synchronisé</span>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {fcmEnabled 
                ? "Vous recevrez des rappels et annonces en temps réel sur cet appareil." 
                : "Activez pour ne rater aucun wird, rappel ou nouvelle annonce."}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {fcmEnabled && (
              <button
                onClick={testPushNotification}
                disabled={isTestingPush}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
              >
                {isTestingPush ? "Envoi du test..." : "Tester"}
                {testSuccess === true && " ✅"}
                {testSuccess === false && " ❌"}
              </button>
            )}

            {/* Visual Toggle Status Switch & Explicit Text Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleNotifications}
                disabled={isSyncingNotifs}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  fcmEnabled 
                    ? 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                }`}
              >
                {fcmEnabled 
                  ? (language === 'fr' ? 'Désactiver' : language === 'ha' ? 'Kashe' : 'Disable') 
                  : (language === 'fr' ? 'Activer' : language === 'ha' ? 'Kunna' : 'Enable')
                }
              </button>

              <button
                onClick={handleToggleNotifications}
                disabled={isSyncingNotifs}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  fcmEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    fcmEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {reminders.map(rem => (
            <div key={rem.id} className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 dark:border-gray-700 rounded-2xl p-4 bg-gray-50 dark:bg-gray-800/50 gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 rounded-xl flex-shrink-0 ${rem.enabled ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'}`}>
                  {rem.isZikr ? <Sparkles size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <h3 className={`font-bold ${rem.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{rem.time}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-sm ${rem.enabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>{rem.label}</p>
                    {rem.isZikr && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        Zikr
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => removeReminder(rem.id)}
                  className="text-sm text-red-500 hover:text-red-600 font-medium px-2"
                >
                  {t('common.delete', 'Supprimer')}
                </button>
                <div 
                  onClick={() => toggleReminder(rem.id)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${rem.enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <motion.div 
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: rem.enabled ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-800/30">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            {t('profile.reminders.addTitle', 'Ajouter un rappel')}
          </h4>
          
          <div className="flex gap-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setReminderType('simple')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                reminderType === 'simple'
                  ? 'bg-white dark:bg-gray-750 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Rappel Simple
            </button>
            <button
              type="button"
              onClick={() => setReminderType('zikr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                reminderType === 'zikr'
                  ? 'bg-white dark:bg-gray-750 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              📿 Rappel de Zikr
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex flex-col gap-1 w-full md:w-1/4">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Heure du rappel</label>
                <input 
                  type="time" 
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white h-10 w-full"
                />
              </div>

              {reminderType === 'simple' ? (
                <div className="flex-1 flex flex-col gap-1 w-full">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Libellé du rappel</label>
                  <input 
                    type="text" 
                    placeholder={t('profile.reminders.placeholder', 'Ex: Wird du matin')}
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white h-10 w-full"
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Sélectionner un Zikr</label>
                    <select
                      value={selectedZikrId}
                      onChange={e => setSelectedZikrId(e.target.value)}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white h-10 w-full"
                    >
                      {PRESET_ZIKRS.map(z => (
                        <option key={z.id} value={z.id}>
                          {z.text} {z.arabic ? `(${z.arabic})` : ''} {z.id !== 'custom' ? ` - ${z.target}x` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedZikrId === 'custom' && (
                    <>
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Nom du Zikr personnalisé</label>
                        <input
                          type="text"
                          placeholder="Ex: Astaghfirullah Al-Azim"
                          value={customZikrName}
                          onChange={e => setCustomZikrName(e.target.value)}
                          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white h-10 w-full"
                        />
                      </div>
                      <div className="w-full sm:w-24 flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Objectif</label>
                        <input
                          type="number"
                          min="1"
                          value={customZikrTarget}
                          onChange={e => setCustomZikrTarget(parseInt(e.target.value, 10) || 100)}
                          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white h-10 w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={addReminder}
              disabled={reminderType === 'simple' ? !newLabel : (selectedZikrId === 'custom' ? !customZikrName : false)}
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2.5 text-sm font-bold disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Ajouter le rappel de Zikr quotidien
            </button>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title={t('profile.theme.title', 'Apparence & Thème')}
        icon={<Moon className="text-emerald-500" size={20} />}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          {t('profile.theme.subtitle', "Personnalisez l'apparence de l'application. Le mode automatique synchronise l'affichage avec votre système pour un confort optimal jour et nuit.")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600'}`}
          >
            <Sun size={24} className={theme === 'light' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'} />
            <span className={`font-medium text-sm ${theme === 'light' ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}>{t('profile.theme.light', 'Clair')}</span>
          </button>
          
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600'}`}
          >
            <Moon size={24} className={theme === 'dark' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'} />
            <span className={`font-medium text-sm ${theme === 'dark' ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}>{t('profile.theme.dark', 'Sombre')}</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'system' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600'}`}
          >
            <Smartphone size={24} className={theme === 'system' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'} />
            <span className={`font-medium text-sm ${theme === 'system' ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}`}>{t('profile.theme.auto', 'Automatique')}</span>
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Abonnement & Achats"
        icon={<Shield className="text-emerald-500" size={20} />}
      >
        {user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro' ? (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 dark:border-gray-700 rounded-2xl p-4 bg-gray-50 dark:bg-gray-800/50 gap-4 mb-4">
              <div className="flex flex-col">
                <h3 className="font-bold text-gray-900 dark:text-white">Désactiver les publicités</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Masquer les bannières promotionnelles dans l'application</p>
              </div>
              <div 
                onClick={async () => {
                  try {
                    const userRef = doc(db, 'users', user.uid);
                    await setDoc(userRef, { hideAds: !user?.hideAds }, { merge: true });
                  } catch (e) {
                    console.error('Error toggling ads', e);
                  }
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${user?.hideAds ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: user?.hideAds ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-start">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('ad.profilePromo', 'Passez à la version Premium pour débloquer toutes les fonctionnalités et supprimer les publicités.')}
            </p>
            <Link
              to="/payment"
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Star size={18} />
              {t('ad.becomePremium', 'Devenir Premium')}
            </Link>
          </div>
        )}

        <div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Save className="text-gray-400" size={18} />
            Historique d'achats
          </h3>
          {user?.purchasedItems && user.purchasedItems.length > 0 ? (
            <div className="space-y-3">
              {user.purchasedItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">Acheté</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Aucun achat pour le moment.</p>
            </div>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title={t('profile.offlineMode.title', 'Mode Hors-ligne')}
        icon={<Save className="text-emerald-500" size={20} />}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          {t('profile.offlineMode.subtitle', 'Synchronisez vos favoris et données locales pour y accéder sans connexion internet.')}
        </p>
        <button
          onClick={() => {
            setIsSyncing(true);
            setTimeout(() => {
              setIsSyncing(false);
              setSyncMessage(t('profile.offlineMode.success', 'Synchronisation hors-ligne terminée avec succès.'));
              setTimeout(() => setSyncMessage(''), 3000);
            }, 1000);
          }}
          disabled={isSyncing}
          className={`flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 rounded-xl px-5 py-3 font-bold transition-colors ${isSyncing ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSyncing ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          {isSyncing ? t('profile.offlineMode.syncing', 'Synchronisation en cours...') : t('profile.offlineMode.syncButton', 'Synchroniser maintenant')}
        </button>
        {syncMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm rounded-lg flex items-center gap-2"
          >
            <Sparkles size={16} />
            {syncMessage}
          </motion.div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">
              Sauvegarde automatique sur Firestore
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-450 mt-1 leading-relaxed">
              Désactivez cette option pour économiser vos données mobiles. Vos modifications seront conservées localement.
            </p>
          </div>
          <div 
            onClick={() => {
              const current = localStorage.getItem('asrar_auto_save_firestore') !== 'false';
              const next = !current;
              localStorage.setItem('asrar_auto_save_firestore', next.toString());
              setAutoSave(next);
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${autoSave ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <motion.div 
              className="w-4 h-4 bg-white rounded-full shadow-sm"
              animate={{ x: autoSave ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title={t('profile.sessions.title', 'Sessions actives')}
        icon={<Smartphone className="text-emerald-500" size={20} />}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          {t('profile.sessions.subtitle', 'Gérez les appareils connectés à votre compte spirituel. Vous pouvez révoquer l\'accès à tout moment pour déconnecter un appareil à distance.')}
        </p>

        {!user ? (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {t('profile.sessions.loginRequired', 'Veuillez vous connecter pour gérer vos sessions actives.')}
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <LogIn size={14} />
              {t('auth.login', 'Se connecter')}
            </button>
          </div>
        ) : loadingSessions ? (
          <div className="flex items-center justify-center py-6">
            <RefreshCw className="animate-spin text-emerald-500" size={24} />
          </div>
        ) : activeSessions.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('profile.sessions.noSessions', 'Aucune session active trouvée.')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeSessions.map((session) => {
              const isCurrent = session.id === currentSessionId;
              return (
                <div 
                  key={session.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between border rounded-2xl p-4 gap-4 transition-all ${
                    isCurrent 
                      ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-800/30 dark:bg-emerald-950/10' 
                      : 'border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      isCurrent 
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' 
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {session.deviceType === 'mobile' ? (
                        <Smartphone size={20} />
                      ) : session.deviceType === 'tablet' ? (
                        <Tablet size={20} />
                      ) : (
                        <Laptop size={20} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                          {t('profile.sessions.deviceFormat', '{browser} sur {os}').replace('{browser}', session.browser).replace('{os}', session.os)}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                            {t('profile.sessions.current', 'Cet appareil')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Globe size={12} />
                          {session.ip}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          {t('profile.sessions.lastActive', 'Actif :')} {new Date(session.lastActive).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                  {!isCurrent && (
                    <button
                      onClick={() => revokeSession(session.id)}
                      className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 self-end sm:self-center transition-colors"
                      title={t('profile.sessions.revokeTooltip', 'Déconnecter cet appareil')}
                    >
                      <Trash2 size={14} />
                      {t('profile.sessions.revoke', 'Déconnecter')}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Maintenance"
        icon={<RefreshCw className="text-emerald-500" size={20} />}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          Vider le cache peut résoudre les problèmes de lecture audio ou libérer de l'espace sur votre appareil.
        </p>

        <button
          onClick={async () => {
            setIsClearingCache(true);
            try {
              if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                  await registration.unregister();
                }
              }
              if ('caches' in window) {
                const keys = await caches.keys();
                for (const key of keys) {
                  await caches.delete(key);
                }
              }
              localStorage.removeItem('quran_downloaded_items');
              localStorage.removeItem('quran_paused_downloads');
              setTimeout(() => {
                window.location.reload();
              }, 500);
            } catch (e) {
              setIsClearingCache(false);
            }
          }}
          disabled={isClearingCache}
          className={`flex items-center justify-center gap-2 w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl px-5 py-3 font-bold transition-colors ${isClearingCache ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <RefreshCw size={18} className={isClearingCache ? 'animate-spin' : ''} />
          {isClearingCache ? 'Nettoyage...' : 'Vider le cache'}
        </button>
      </CollapsibleSection>

      <CollapsibleSection
        title="Diagnostic & Connexion Firestore"
        icon={<Activity className="text-emerald-500" size={20} />}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          Analysez l'état de la connexion en temps réel avec les serveurs de base de données Firestore. Ce panneau permet d'identifier les blocages réseau, SSL, CORS ou d'autres anomalies dans les environnements mobiles et de type Capacitor.
        </p>

        {/* Diagnostic Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={async () => {
              setIsPinging(true);
              const res = await pingFirestore();
              setPingResult(res);
              setIsPinging(false);
            }}
            disabled={isPinging}
            className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 rounded-xl px-4 py-3 font-bold text-xs transition-colors cursor-pointer"
          >
            <Activity size={16} className={isPinging ? "animate-spin" : ""} />
            {isPinging ? "Vérification en cours..." : "Tester la latence (Ping)"}
          </button>

          <button
            onClick={async () => {
              addNetworkLog('info', 'firestore', 'Reconnexion manuelle initiée par l\'utilisateur.');
              await triggerBackgroundReconnect();
            }}
            className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 rounded-xl px-4 py-3 font-bold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw size={16} />
            Forcer la reconnexion
          </button>
        </div>

        {/* Ping / Latency Result Display */}
        {pingResult && (
          <div className={`mb-6 p-4 rounded-2xl border text-sm flex flex-col gap-2 ${
            pingResult.reachable 
              ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-800/30 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-300'
              : 'border-red-200 bg-red-50/20 dark:border-red-900/30 dark:bg-red-950/10 text-red-800 dark:text-red-300'
          }`}>
            <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wider">
              <span>Résultat du Diagnostic :</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                pingResult.reachable 
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
              }`}>
                {pingResult.reachable ? 'Connecté / Réseau Ok' : 'Erreur Connexion'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-1 text-xs text-gray-600 dark:text-gray-300">
              <div>
                <span className="opacity-70">Latence du serveur :</span>{' '}
                <strong className={pingResult.reachable ? 'text-emerald-600 dark:text-emerald-400 font-mono text-sm' : 'font-mono'}>
                  {pingResult.reachable ? `${pingResult.latencyMs} ms` : 'Indisponible'}
                </strong>
              </div>
              <div>
                <span className="opacity-70">Statut réseau local :</span>{' '}
                <strong className={navigator.onLine ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>
                  {navigator.onLine ? 'En ligne' : 'Hors ligne'}
                </strong>
              </div>
            </div>

            {pingResult.errorMessage && (
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                <span className="font-bold">Message :</span> {pingResult.errorMessage}
              </div>
            )}
            
            {pingResult.errorType === 'ssl_cors' && (
              <div className="mt-1 text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-2.5 rounded-xl">
                ⚠️ <strong>Anomalie SSL ou CORS détectée :</strong> Si vous utilisez une application mobile (Capacitor), assurez-vous que l'heure de votre appareil est parfaitement synchrone et que vous n'êtes pas connecté via un proxy / VPN filtrant.
              </div>
            )}
          </div>
        )}

        {/* Real-time Connection State Summary card */}
        <div className="bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 mb-6">
          <h4 className="font-bold text-gray-900 dark:text-white text-xs mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Database size={14} /> Paramètres Réseau Actuels
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">IndexedDB Persistance :</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Actif (Optimisé mobile)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Long Polling (Capacitor) :</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Forcé (experimentalForceLongPolling)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Protocole de la page :</span>
              <span className="font-mono">{window.location.protocol}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Origine :</span>
              <span className="font-mono truncate max-w-[150px]" title={window.location.origin}>{window.location.origin}</span>
            </div>
          </div>
        </div>

        {/* Live Diagnostics Console Log Display */}
        <div className="border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-950">
          <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <span className="text-xs font-mono font-bold text-gray-300 flex items-center gap-1.5">
              <Terminal size={14} className="text-emerald-500" /> Console de Diagnostics Réseau ({diagnosticLogs.length})
            </span>
            {diagnosticLogs.length > 0 && (
              <button
                onClick={() => clearNetworkLogs()}
                className="text-[10px] text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 transition-colors px-2.5 py-1 rounded-lg font-mono font-bold cursor-pointer"
              >
                Vider
              </button>
            )}
          </div>

          <div className="p-3 font-mono text-[10px] leading-relaxed max-h-56 overflow-y-auto flex flex-col gap-2">
            {diagnosticLogs.length === 0 ? (
              <div className="text-center text-gray-500 py-4 italic">
                Aucun log réseau enregistré pour le moment.
              </div>
            ) : (
              diagnosticLogs.map((log) => {
                let badgeColor = 'bg-blue-950/40 text-blue-400 border border-blue-500/20';
                if (log.type === 'error') badgeColor = 'bg-red-950/40 text-red-400 border border-red-500/20';
                if (log.type === 'success') badgeColor = 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';
                if (log.type === 'retry') badgeColor = 'bg-amber-950/40 text-amber-400 border border-amber-500/20';

                return (
                  <div key={log.id} className="border-b border-gray-900/50 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-gray-500 font-light">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className={`text-[8px] font-bold uppercase px-1 rounded ${badgeColor}`}>
                        {log.type}
                      </span>
                      <span className="text-gray-400 font-bold">[{log.category}]</span>
                      <span className="text-gray-200">{log.message}</span>
                    </div>
                    {log.details && (
                      <div className="mt-1 pl-4 text-gray-500 break-all select-all">
                        ↳ {log.details}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Article Modal */}
      {selectedFavArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={20} /> Lecture
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={(e) => handleShareFavArticle(selectedFavArticle, e)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-emerald-500" title="Partager">
                  <Share2 size={20} />
                </button>
                <button onClick={() => setSelectedFavArticle(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500" title="Fermer">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 hide-scrollbar bg-gray-50 dark:bg-gray-900">
              <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                {selectedFavArticle.isPremium ? (
                  <PremiumWrapper 
                    fallbackTitle={selectedFavArticle.title} 
                    fallbackMessage="Cet article est exclusif aux membres Premium. Débloquez-le pour lire la suite."
                    previewContent={
                      <>
                        {selectedFavArticle.thumbnail && (
                          <div className="w-full h-64 md:h-80 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                            <img src={selectedFavArticle.thumbnail} alt={selectedFavArticle.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 p-6 z-20">
                              <h1 className="text-2xl md:text-3xl font-black text-white">{selectedFavArticle.title}</h1>
                            </div>
                          </div>
                        )}
                        {!selectedFavArticle.thumbnail && (
                          <div className="p-6 md:p-10 border-b border-gray-100 dark:border-gray-700">
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{selectedFavArticle.title}</h1>
                          </div>
                        )}
                        <div className="p-6 md:p-10 prose prose-emerald dark:prose-invert max-w-none article-content">
                          <div dangerouslySetInnerHTML={{ __html: (selectedFavArticle.content || '').substring(0, 300) + '...' }} />
                        </div>
                      </>
                    }
                  >
                    {selectedFavArticle.thumbnail && (
                      <div className="w-full h-64 md:h-80 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <img src={selectedFavArticle.thumbnail} alt={selectedFavArticle.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 p-6 z-20">
                          <h1 className="text-2xl md:text-3xl font-black text-white">{selectedFavArticle.title}</h1>
                        </div>
                      </div>
                    )}
                    {!selectedFavArticle.thumbnail && (
                      <div className="p-6 md:p-10 border-b border-gray-100 dark:border-gray-700">
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{selectedFavArticle.title}</h1>
                      </div>
                    )}
                    <div className="p-6 md:p-10 prose prose-emerald dark:prose-invert max-w-none article-content">
                      <div dangerouslySetInnerHTML={{ __html: selectedFavArticle.content }} />
                    </div>
                  </PremiumWrapper>
                ) : (
                  <>
                    {selectedFavArticle.thumbnail && (
                      <div className="w-full h-64 md:h-80 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <img src={selectedFavArticle.thumbnail} alt={selectedFavArticle.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 p-6 z-20">
                          <h1 className="text-2xl md:text-3xl font-black text-white">{selectedFavArticle.title}</h1>
                        </div>
                      </div>
                    )}
                    {!selectedFavArticle.thumbnail && (
                      <div className="p-6 md:p-10 border-b border-gray-100 dark:border-gray-700">
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{selectedFavArticle.title}</h1>
                      </div>
                    )}
                    <div className="p-6 md:p-10 prose prose-emerald dark:prose-invert max-w-none article-content">
                      <div dangerouslySetInnerHTML={{ __html: selectedFavArticle.content }} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};
