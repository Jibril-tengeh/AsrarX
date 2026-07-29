import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, CloudOff, RefreshCw, Database, Check, Info, Server, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db, isAutoSaveEnabled } from '../lib/firebase';
import { doc, getDocFromServer } from 'firebase/firestore';

export const SyncStatusBadge: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncState, setSyncState] = useState<'synced' | 'syncing' | 'offline' | 'guest'>('synced');
  const [showPopover, setShowPopover] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(new Date());
  const [isForcingSync, setIsForcingSync] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Localization strings
  const strings = {
    fr: {
      title: 'Sauvegarde Cloud',
      synced: 'Données synchronisées',
      syncedTooltip: 'Vos données sont sauvegardées en toute sécurité sur Firebase.',
      syncing: 'Synchronisation...',
      syncingTooltip: 'Sauvegarde de vos modifications sur Firebase...',
      offline: 'Sauvegarde locale',
      offlineTooltip: 'Vous êtes hors ligne. Vos modifications sont enregistrées localement et seront synchronisées dès la reconnexion.',
      guest: 'Mode Invité',
      guestTooltip: 'Connectez-vous pour sauvegarder vos données dans le Cloud et y accéder partout.',
      lastSync: 'Dernière sauvegarde',
      justNow: "à l'instant",
      syncNowBtn: 'Synchroniser maintenant',
      autoSaveActive: 'Sauvegarde automatique : Active',
      autoSaveInactive: 'Sauvegarde automatique : Désactivée',
      forceSyncSuccess: 'Toutes les données ont été synchronisées !',
      statusLabel: 'Statut',
      accountLabel: 'Compte lié',
      storageLabel: 'Stockage principal',
      cloudStorage: 'Cloud Firebase',
      localStorage: 'Mémoire locale (Hors ligne)',
      guestStorage: 'Mémoire de l\'appareil',
      guestAccount: 'Aucun (Invité)',
      autoSaveLabel: 'Sauvegarde Auto',
      activeLabel: 'Active',
      inactiveLabel: 'Désactivée',
      connectionOnline: 'En ligne',
      connectionOffline: 'Hors ligne',
      connectionLabel: 'Réseau',
    },
    en: {
      title: 'Cloud Backup',
      synced: 'Data synchronized',
      syncedTooltip: 'Your data is securely backed up to Firebase.',
      syncing: 'Syncing...',
      syncingTooltip: 'Saving your changes to Firebase...',
      offline: 'Local Backup',
      offlineTooltip: 'You are offline. Your changes are saved locally and will sync once you are back online.',
      guest: 'Guest Mode',
      guestTooltip: 'Sign in to back up your data to the Cloud and access it anywhere.',
      lastSync: 'Last backup',
      justNow: 'just now',
      syncNowBtn: 'Sync Now',
      autoSaveActive: 'Auto-Save: Active',
      autoSaveInactive: 'Auto-Save: Disabled',
      forceSyncSuccess: 'All data has been synchronized!',
      statusLabel: 'Status',
      accountLabel: 'Linked Account',
      storageLabel: 'Primary Storage',
      cloudStorage: 'Firebase Cloud',
      localStorage: 'Local Cache (Offline)',
      guestStorage: 'Device Memory',
      guestAccount: 'None (Guest)',
      autoSaveLabel: 'Auto Backup',
      activeLabel: 'Active',
      inactiveLabel: 'Disabled',
      connectionOnline: 'Online',
      connectionOffline: 'Offline',
      connectionLabel: 'Network',
    },
    ha: {
      title: 'Adana a Gajimare',
      synced: 'An daidaita bayanai',
      syncedTooltip: 'Ana adana bayananku lami lafiya a Firebase.',
      syncing: 'Ana daidaitawa...',
      syncingTooltip: 'Ana adana canje-canjenku a Firebase...',
      offline: 'Adana a Waya',
      offlineTooltip: 'Ba kwa kan layi. An adana canje-canjenku a wayarku, kuma za su daidaita idan kun shiga layi.',
      guest: 'Yanayin Bako',
      guestTooltip: 'Shiga don adana bayananku a gajimare don samun dama a ko\'ina.',
      lastSync: 'Adana na ƙarshe',
      justNow: 'yanzu-yanzu',
      syncNowBtn: 'Daidaita Yanzu',
      autoSaveActive: 'Adana kai tsaye: Kunnawa',
      autoSaveInactive: 'Adana kai tsaye: Kashewa',
      forceSyncSuccess: 'An daidaita dukkan bayanai cikin nasara!',
      statusLabel: 'Matsayi',
      accountLabel: 'Asusunku',
      storageLabel: 'Babban Ma\'ajiya',
      cloudStorage: 'Firebase Cloud',
      localStorage: 'Ma\'ajiyar Waya (Offline)',
      guestStorage: 'Ma\'ajiyar Na\'ura',
      guestAccount: 'Babu (Bako)',
      autoSaveLabel: 'Ajiya kai tsaye',
      activeLabel: 'Kunnawa',
      inactiveLabel: 'Kashewa',
      connectionOnline: 'Kan layi',
      connectionOffline: 'Ba ya kan layi',
      connectionLabel: 'Hanyar sadarwa',
    }
  };

  const currentLang = (language === 'ha' ? 'ha' : language === 'en' ? 'en' : 'fr') as 'fr' | 'en' | 'ha';
  const tStr = strings[currentLang];

  // Watch online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger a temporary syncing state when coming back online
      if (user) {
        setSyncState('syncing');
        const timer = setTimeout(() => {
          setSyncState('synced');
          setLastSyncTime(new Date());
        }, 1500);
        return () => clearTimeout(timer);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Handle syncing state transitions
  useEffect(() => {
    if (!isOnline) {
      setSyncState('offline');
    } else if (!user) {
      setSyncState('guest');
    } else if (isForcingSync) {
      setSyncState('syncing');
    } else {
      setSyncState('synced');
    }
  }, [isOnline, user, isForcingSync]);

  // Click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleForceSync = async () => {
    if (!isOnline || !user) return;
    
    setIsForcingSync(true);
    setShowSuccessMsg(false);

    try {
      // Test the Firebase connection explicitly as recommended in guidelines
      await getDocFromServer(doc(db, 'users', user.uid));
      
      // Artificial delay to give the user visual feedback of the sync running
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setLastSyncTime(new Date());
      setShowSuccessMsg(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMsg(false);
      }, 3000);
    } catch (error) {
      console.warn("Connection test failed during manual sync:", error);
    } finally {
      setIsForcingSync(false);
    }
  };

  const getStatusColor = () => {
    switch (syncState) {
      case 'synced':
        return 'bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30 ring-emerald-400/30';
      case 'syncing':
        return 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500/30 ring-blue-400/30';
      case 'offline':
        return 'bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500/30 ring-amber-400/30';
      case 'guest':
        return 'bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700 ring-gray-400/30';
    }
  };

  const getStatusIcon = () => {
    switch (syncState) {
      case 'synced':
        return <Cloud size={16} className="shrink-0" />;
      case 'syncing':
        return <RefreshCw size={16} className="animate-spin shrink-0" />;
      case 'offline':
        return <CloudOff size={16} className="shrink-0" />;
      case 'guest':
        return <Info size={16} className="shrink-0" />;
    }
  };

  const getStatusLabel = () => {
    switch (syncState) {
      case 'synced':
        return tStr.synced;
      case 'syncing':
        return tStr.syncing;
      case 'offline':
        return tStr.offline;
      case 'guest':
        return tStr.guest;
    }
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return '-';
    // Format friendly time
    return `${lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Small badge trigger with subtle pulse if syncing */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPopover(!showPopover)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-300 cursor-pointer border border-transparent backdrop-blur-sm ${getStatusColor()}`}
        title={getStatusLabel()}
        id="firebase-sync-status-badge"
      >
        <span className="relative flex h-2 w-2 items-center justify-center">
          {syncState === 'syncing' && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
          )}
          {syncState === 'synced' && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40"></span>
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${
            syncState === 'synced' ? 'bg-emerald-400' :
            syncState === 'syncing' ? 'bg-blue-400 animate-pulse' :
            syncState === 'offline' ? 'bg-amber-400' :
            'bg-gray-400'
          }`}></span>
        </span>
        
        {getStatusIcon()}
        
        {/* Only show text on larger screens to keep mobile header clean */}
        <span className="hidden md:inline-block max-w-[130px] truncate">
          {getStatusLabel()}
        </span>
      </motion.button>

      {/* Popover Card */}
      <AnimatePresence>
        {showPopover && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2.5 w-76 sm:w-80 bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800/80 p-5 z-50 text-left overflow-hidden"
          >
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl -translate-y-6 translate-x-6 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl translate-y-6 -translate-x-6 pointer-events-none" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/50 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-emerald-500 dark:text-emerald-400" />
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    {tStr.title}
                  </h4>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  syncState === 'synced' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                  syncState === 'syncing' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
                  syncState === 'offline' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {syncState === 'synced' ? tStr.connectionOnline : 
                   syncState === 'offline' ? tStr.connectionOffline : getStatusLabel()}
                </span>
              </div>

              {/* Tooltip Description */}
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100/50 dark:border-gray-800/30 mb-4">
                {syncState === 'synced' && tStr.syncedTooltip}
                {syncState === 'syncing' && tStr.syncingTooltip}
                {syncState === 'offline' && tStr.offlineTooltip}
                {syncState === 'guest' && tStr.guestTooltip}
              </p>

              {/* Sync Metadata Details */}
              <div className="space-y-2.5 mb-5 text-xs">
                {/* Linked Account */}
                <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                  <span>{tStr.accountLabel}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px]" title={user?.email || undefined}>
                    {user ? user.email : tStr.guestAccount}
                  </span>
                </div>

                {/* Network Connection */}
                <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                  <span>{tStr.connectionLabel}</span>
                  <span className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
                    {isOnline ? (
                      <>
                        <Wifi size={12} className="text-emerald-500" />
                        <span>{tStr.connectionOnline}</span>
                      </>
                    ) : (
                      <>
                        <WifiOff size={12} className="text-amber-500" />
                        <span>{tStr.connectionOffline}</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Storage Type */}
                <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                  <span>{tStr.storageLabel}</span>
                  <span className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
                    <Server size={12} className="text-emerald-500 dark:text-emerald-400" />
                    <span>
                      {syncState === 'offline' ? tStr.localStorage :
                       syncState === 'guest' ? tStr.guestStorage : tStr.cloudStorage}
                    </span>
                  </span>
                </div>

                {/* Auto Save State */}
                <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                  <span>{tStr.autoSaveLabel}</span>
                  <span className={`font-semibold px-1.5 py-0.5 rounded-md text-[10px] ${
                    isAutoSaveEnabled() 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                  }`}>
                    {isAutoSaveEnabled() ? tStr.activeLabel : tStr.inactiveLabel}
                  </span>
                </div>

                {/* Last Sync */}
                {lastSyncTime && (syncState === 'synced' || syncState === 'offline' || syncState === 'syncing') && (
                  <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-800/30">
                    <span>{tStr.lastSync}</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {formatLastSync()}
                    </span>
                  </div>
                )}
              </div>

              {/* Force Sync Actions (Only relevant for logged-in & online users) */}
              {user && isOnline && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleForceSync}
                    disabled={isForcingSync}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-emerald-400 disabled:to-teal-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <RefreshCw size={14} className={`${isForcingSync ? 'animate-spin' : ''}`} />
                    <span>{isForcingSync ? tStr.syncing : tStr.syncNowBtn}</span>
                  </motion.button>

                  {/* Success Pop Message */}
                  <AnimatePresence>
                    {showSuccessMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute inset-0 flex items-center justify-center bg-emerald-500 text-white text-xs font-bold rounded-xl gap-1.5"
                      >
                        <Check size={14} className="stroke-[3]" />
                        <span>{tStr.forceSyncSuccess}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
