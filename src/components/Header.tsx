import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Moon, Sun, Languages, User, Users, Shield, LogOut, LogIn, Bell, BellOff, Store, ChevronDown, ChevronUp, Megaphone, X, ExternalLink, MessageCircle, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useFeatures } from '../contexts/FeatureContext';
import { signOut, db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit, doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GlobalSearchModal } from './GlobalSearchModal';
import { AsrarLogo } from './AsrarLogo';
import { SyncStatusBadge } from './SyncStatusBadge';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
}

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { featureToggles } = useFeatures();
   const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [showEnableNotifPopup, setShowEnableNotifPopup] = useState(false);
  const [notifsEnabled, setNotifsEnabled] = useState(false);
  const initialLoadTime = useRef(Date.now());
  const langMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if ('Notification' in window) {
      setNotifsEnabled(Notification.permission === 'granted');
      
      const handleFocus = () => {
        setNotifsEnabled(Notification.permission === 'granted');
      };
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user && user.pushNotificationsEnabled !== undefined) {
      setNotifsEnabled(!!user.pushNotificationsEnabled);
    }
  }, [user, user?.pushNotificationsEnabled]);

  const toggleHeaderNotifications = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const targetState = !notifsEnabled;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        pushNotificationsEnabled: targetState
      });
      setNotifsEnabled(targetState);
    } catch (err) {
      console.error("Error toggling notifications in header:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(5));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        setNotifications(notifs);
        
        // Check for unread
        const lastSeen = localStorage.getItem('asrarhub_last_seen_notif');
        if (notifs.length > 0) {
          if (!lastSeen || new Date(notifs[0].date).getTime() > parseInt(lastSeen)) {
            setHasUnread(true);
          }
          
          // Check if any is a NEW notification published after initial page load
          const hasNewNotif = snapshot.docs.some(doc => {
            const data = doc.data();
            const docTime = data.createdAt?.toDate ? data.createdAt.toDate().getTime() : (data.date ? new Date(data.date).getTime() : 0);
            return docTime > initialLoadTime.current;
          });

          if (hasNewNotif && Notification.permission !== 'granted') {
            setShowEnableNotifPopup(true);
          }
        }
      }, (error) => {
        console.error("Header notifications onSnapshot error:", error);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'), limit(1));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const firstDoc = snapshot.docs[0];
          const data = firstDoc.data();
          const docTime = data.createdAt || 0;
          
          if (docTime > initialLoadTime.current && Notification.permission !== 'granted') {
            setShowEnableNotifPopup(true);
          }
        }
      }, (error) => {
        console.error("Header articles onSnapshot error:", error);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleOpenNotifs = () => {
    setNotifMenuOpen(!notifMenuOpen);
    if (!notifMenuOpen) {
      setHasUnread(false);
      localStorage.setItem('asrarhub_last_seen_notif', Date.now().toString());
    }
  };

  const changeLanguage = (lang: 'fr' | 'en' | 'ha') => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  const secretClickCount = useRef(0);
  const secretClickTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleSecretClick = () => {
    if (user?.role === 'admin') return;
    
    secretClickCount.current += 1;
    
    if (secretClickTimeout.current) {
      clearTimeout(secretClickTimeout.current);
    }
    
    if (secretClickCount.current >= 20) {
      sessionStorage.setItem('admin_bypass', 'true');
      navigate('/admin');
      secretClickCount.current = 0;
    } else {
      secretClickTimeout.current = setTimeout(() => {
        secretClickCount.current = 0;
      }, 1500);
    }
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'py-3 bg-emerald-600 dark:bg-emerald-800 shadow-lg' 
            : 'py-4 bg-emerald-600 dark:bg-emerald-800'
        } px-3 sm:px-6`}
        onClick={handleSecretClick}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <AsrarLogo variant="horizontal" size="md" className="text-white hover:opacity-90 transition-opacity" hideSymbol={true} />
          </Link>
          
          <div className="flex items-center space-x-1 sm:space-x-3">
            
            {featureToggles['tool_community'] !== 'inactive' && (
              <Link to="/community" id="tour-community">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors hidden sm:flex"
                  aria-label="Community"
                >
                  <Users size={18} />
                </motion.div>
              </Link>
            )}

            {user && (
              <div className="relative" ref={notifMenuRef} id="tour-notifications">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenNotifs}
                  className="relative p-1.5 sm:p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors"
                  aria-label="Notifications"
                >
                  {notifsEnabled ? (
                    <Bell size={18} />
                  ) : (
                    <BellOff size={18} className="opacity-75" />
                  )}
                  {hasUnread && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-yellow-900 text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm border border-emerald-600 dark:border-emerald-800">
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {notifMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -right-24 sm:right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 flex flex-col"
                    >
                      <div className="p-3 border-b border-gray-100 dark:border-gray-700 font-bold text-sm text-gray-900 dark:text-white flex justify-between items-center">
                        <span>{language === 'fr' ? 'Notifications' : language === 'ha' ? 'Sanarwa' : 'Notifications'}</span>
                        <button 
                          onClick={toggleHeaderNotifications} 
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                            notifsEnabled 
                              ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30' 
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                          }`}
                        >
                          {notifsEnabled 
                            ? (language === 'fr' ? 'Désactiver' : language === 'ha' ? 'Kashe' : 'Disable') 
                            : (language === 'fr' ? 'Activer' : language === 'ha' ? 'Kunna' : 'Enable')
                          }
                        </button>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">{language === 'fr' ? 'Aucune notification' : language === 'ha' ? 'Babu sanarwa' : 'No notifications'}</div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto">
                          {notifications.map(notif => {
                            const lang = language;
                            const title = (notif as any)[`title_${lang}`] || notif.title;
                            const message = (notif as any)[`message_${lang}`] || notif.message;
                            return (
                            <div key={notif.id} className="p-3 border-b border-gray-50 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                              <h4 className="text-xs font-bold text-gray-900 dark:text-white">{title}</h4>
                              <p className="text-[10px] text-gray-500 mt-0.5">{new Date(notif.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{message}</p>
                            </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="relative" ref={langMenuRef} id="tour-language">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1 p-1.5 sm:p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors"
                aria-label="Toggle language menu"
              >
                <Languages size={18} />
              </motion.button>
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 flex flex-col"
                  >
                    <button 
                      onClick={() => changeLanguage('fr')} 
                      className={`px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center ${language === 'fr' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-gray-700 dark:text-gray-200'}`}
                    >
                      <span>Français</span>
                      {language === 'fr' && <span className="text-emerald-500 text-xs">●</span>}
                    </button>
                    <button 
                      onClick={() => changeLanguage('en')} 
                      className={`px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center ${language === 'en' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-gray-700 dark:text-gray-200'}`}
                    >
                      <span>English</span>
                      {language === 'en' && <span className="text-emerald-500 text-xs">●</span>}
                    </button>
                    <button 
                      onClick={() => changeLanguage('ha')} 
                      className={`px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center ${language === 'ha' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-gray-700 dark:text-gray-200'}`}
                    >
                      <span>Hausa</span>
                      {language === 'ha' && <span className="text-emerald-500 text-xs">●</span>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button
              id="tour-theme"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </motion.button>

            <motion.button
              id="tour-search-global"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchModalOpen(true)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors"
              aria-label="Global Search"
            >
              <Search size={18} />
            </motion.button>



            {featureToggles['tool_community'] !== 'inactive' && (
              <Link to="/community" className="sm:hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors"
                  aria-label="Community"
                >
                  <Users size={18} />
                </motion.div>
              </Link>
            )}

            {(user?.role === 'admin' || ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'].includes(user?.email?.toLowerCase() || '')) && (
              <Link to="/admin">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-emerald-700 dark:hover:bg-emerald-900 text-white transition-colors flex items-center justify-center"
                  aria-label="Admin Dashboard"
                >
                  <Shield size={18} />
                </motion.div>
              </Link>
            )}

            <SyncStatusBadge />

            <Link to="/profile" id="tour-profile">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center overflow-hidden ring-2 ring-white/20 cursor-pointer ml-0.5 sm:ml-1"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-white" size={16} />
                )}
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {announcementOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-24 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[100]"
          >
            <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">{t('ad.specialAd', 'Annonce Spéciale')}</div>
                  <button 
                    onClick={() => setAnnouncementOpen(false)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <h4 className="font-bold text-xl mb-2 mt-2 leading-tight">{t('ad.unlockTitle', 'Débloquez votre plein potentiel spirituel')}</h4>
                <p className="text-blue-100 text-sm mb-4 leading-relaxed">{t('ad.unlockDesc', 'Passez à la version Premium pour accéder aux cours Sirr Al Asrar complets et supprimer ces publicités.')}</p>
                <Link 
                  to="/payment" 
                  onClick={() => setAnnouncementOpen(false)}
                  className="w-full text-center bg-white text-indigo-900 px-5 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  {t('ad.viewOffers', 'Voir les Offres')} <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEnableNotifPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-gray-100 dark:border-gray-800 relative text-center"
            >
              <button
                onClick={() => setShowEnableNotifPopup(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
                <Bell size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'fr' ? 'Activer les notifications ?' : language === 'ha' ? 'Kunna sanarwa?' : 'Enable Notifications?'}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {language === 'fr' 
                  ? 'Une nouvelle publication ou notification est arrivée ! Pour ne rater aucune mise à jour importante d\'AsrarHub, veuillez activer les notifications dans votre profil.' 
                  : language === 'ha' 
                    ? 'Sabuwar sanarwa ko labari ya fito! Domin kada ku rasa muhimman sabuntawa na AsrarHub, da fatan za ku kunna sanarwa a cikin bayananku.' 
                    : 'A new publication or notification has arrived! To ensure you do not miss any important updates from AsrarHub, please enable notifications in your profile.'}
              </p>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowEnableNotifPopup(false);
                    navigate('/profile');
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User size={16} />
                  {language === 'fr' ? 'Aller sur mon profil' : language === 'ha' ? 'Je zuwa bayana' : 'Go to Profile'}
                </button>
                
                <button
                  onClick={() => setShowEnableNotifPopup(false)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  {language === 'fr' ? 'Plus tard' : language === 'ha' ? 'Daga baya' : 'Later'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Overlay */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
};

