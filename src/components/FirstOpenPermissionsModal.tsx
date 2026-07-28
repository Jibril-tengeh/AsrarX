import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { HardDrive, Bell, Mic, MapPin, Check, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { requestAllPermissions } from '../utils/planetaryNotifications';

export const FirstOpenPermissionsModal: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [grantedState, setGrantedState] = useState<{
    storage?: boolean;
    notifications?: boolean;
    geolocation?: boolean;
    microphone?: boolean;
  }>({});

  useEffect(() => {
    // Check if permissions prompt has already been completed on first open
    const hasRequested = localStorage.getItem('asrarhub_permissions_requested');
    if (!hasRequested) {
      // Delay slightly to allow app UI to render before showing permission modal
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleGrantPermissions = async () => {
    setIsRequesting(true);
    try {
      const res = await requestAllPermissions();
      setGrantedState({
        storage: res.storage,
        notifications: res.notifications,
        geolocation: res.geolocation,
        microphone: res.microphone
      });
      localStorage.setItem('asrarhub_permissions_requested', 'true');
      
      // Delay slightly so user sees success feedback checks before modal closes
      setTimeout(() => {
        setIsOpen(false);
      }, 1200);
    } catch (e) {
      console.warn('Error requesting initial permissions:', e);
      localStorage.setItem('asrarhub_permissions_requested', 'true');
      setIsOpen(false);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('asrarhub_permissions_requested', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const labels = {
    fr: {
      title: 'Autorisations Requises',
      subtitle: 'Pour vous offrir l\'expérience spirituelle optimale, AsrarHub demande les autorisations suivantes lors du premier démarrage :',
      storageTitle: 'Stockage & Fichiers',
      storageDesc: 'Pour sauvegarder le cache hors-ligne, les parchemins et vos journaux.',
      notifTitle: 'Notifications Push',
      notifDesc: 'Pour recevoir les rappels d\'heures planétaires, Sa\'ah al-Ijābah et Zikrs.',
      micTitle: 'Microphone & Audio',
      micDesc: 'Pour le compteur Zikr vocal et la détection sonore.',
      gpsTitle: 'Localisation GPS',
      gpsDesc: 'Pour le calcul précis de la Qibla et des heures de prière.',
      btnGrant: 'Autoriser tous les accès',
      btnGranting: 'Demande des autorisations...',
      btnSkip: 'Plus tard dans les paramètres',
      secureNotice: 'Vos données restent 100% privées et sécurisées sur votre appareil.'
    },
    ha: {
      title: 'Izinodins da ake buƙata',
      subtitle: 'Don samar muku da mafi kyawun ƙwarewa, AsrarHub yana neman waɗannan izini a karon farko :',
      storageTitle: 'Mabuɗin Adana Fayiloli',
      storageDesc: 'Don adana kayayyakin manhaja da bayanan sirri a bango.',
      notifTitle: 'Tura Sanarwa',
      notifDesc: 'Don samun tunatarwar sa\'o\'in taurari da Zikiri na yau da kullun.',
      micTitle: 'Maikirfoni & Sauti',
      micDesc: 'Don ƙididdigar Zikiri ta hanyar murya.',
      gpsTitle: 'Wurin GPS',
      gpsDesc: 'Don lissafin alƙibla da lokutan addu\'a daidai.',
      btnGrant: 'Bada Dukkan Izinodi',
      btnGranting: 'Neman izinodi...',
      btnSkip: 'Daga baya a saitin',
      secureNotice: 'Bayanan ku suna sirri 100% akan na\'urar ku.'
    },
    en: {
      title: 'Permissions Required',
      subtitle: 'To provide you with the best spiritual experience, AsrarHub requests the following permissions on first launch:',
      storageTitle: 'Storage & Files',
      storageDesc: 'To save offline cache, parchments, and journal records.',
      notifTitle: 'Push Notifications',
      notifDesc: 'To receive planetary hour alerts, Sa\'ah al-Ijābah, and Zikr reminders.',
      micTitle: 'Microphone & Audio',
      micDesc: 'For voice Zikr counting and audio analysis.',
      gpsTitle: 'GPS Location',
      gpsDesc: 'For precise Qibla direction and prayer times.',
      btnGrant: 'Grant All Permissions',
      btnGranting: 'Requesting permissions...',
      btnSkip: 'Later in settings',
      secureNotice: 'Your data remains 100% private and secure on your device.'
    }
  };

  const txt = labels[language as keyof typeof labels] || labels.fr;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                {txt.title}
              </h2>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                AsrarHub Spiritual Suite
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
            {txt.subtitle}
          </p>

          {/* List of Permissions */}
          <div className="space-y-3 mb-6">
            {/* Storage */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <HardDrive className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {txt.storageTitle}
                  </h4>
                  {grantedState.storage && <Check className="w-4 h-4 text-emerald-500 font-bold" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {txt.storageDesc}
                </p>
              </div>
            </div>

            {/* Notifications */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {txt.notifTitle}
                  </h4>
                  {grantedState.notifications && <Check className="w-4 h-4 text-emerald-500 font-bold" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {txt.notifDesc}
                </p>
              </div>
            </div>

            {/* Microphone */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {txt.micTitle}
                  </h4>
                  {grantedState.microphone && <Check className="w-4 h-4 text-emerald-500 font-bold" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {txt.micDesc}
                </p>
              </div>
            </div>

            {/* GPS */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {txt.gpsTitle}
                  </h4>
                  {grantedState.geolocation && <Check className="w-4 h-4 text-emerald-500 font-bold" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {txt.gpsDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 mb-5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{txt.secureNotice}</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleGrantPermissions}
              disabled={isRequesting}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-sm shadow-xl shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isRequesting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>{txt.btnGranting}</span>
                </>
              ) : (
                <>
                  <span>{txt.btnGrant}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={handleSkip}
              className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              {txt.btnSkip}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
