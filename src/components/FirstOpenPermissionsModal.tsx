import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { HardDrive, Bell, Mic, MapPin, Check, Sparkles, ShieldCheck, ChevronRight, X, AlertCircle } from 'lucide-react';
import {
  requestNotificationPermission,
  requestStoragePermission,
  requestMicrophonePermission,
  requestGeolocationPermission,
  requestAllPermissions
} from '../utils/planetaryNotifications';

type PermissionKey = 'notifications' | 'storage' | 'microphone' | 'geolocation';

export const FirstOpenPermissionsModal: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0..3 for individual step cards
  const [viewMode, setViewMode] = useState<'step' | 'list'>('step');
  const [isRequesting, setIsRequesting] = useState(false);
  const [grantedState, setGrantedState] = useState<Record<PermissionKey, boolean | null>>({
    notifications: null,
    storage: null,
    microphone: null,
    geolocation: null,
  });

  useEffect(() => {
    // Check if permissions prompt has already been completed
    const hasRequested = localStorage.getItem('asrarhub_permissions_requested');
    if (!hasRequested) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const permissionList: PermissionKey[] = ['notifications', 'storage', 'microphone', 'geolocation'];

  const handleRequestSingle = async (key: PermissionKey, allow: boolean) => {
    setIsRequesting(true);
    let isGranted = false;

    if (allow) {
      try {
        if (key === 'notifications') {
          isGranted = await requestNotificationPermission();
        } else if (key === 'storage') {
          isGranted = await requestStoragePermission();
        } else if (key === 'microphone') {
          isGranted = await requestMicrophonePermission();
        } else if (key === 'geolocation') {
          isGranted = await requestGeolocationPermission();
        }
      } catch (e) {
        console.warn(`Error requesting ${key} permission:`, e);
      }
    } else {
      isGranted = false;
    }

    setGrantedState(prev => ({ ...prev, [key]: isGranted }));
    setIsRequesting(false);

    if (viewMode === 'step') {
      if (currentStepIndex < permissionList.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // Completed all steps
        localStorage.setItem('asrarhub_permissions_requested', 'true');
        setTimeout(() => setIsOpen(false), 500);
      }
    }
  };

  const handleGrantAll = async () => {
    setIsRequesting(true);
    try {
      const res = await requestAllPermissions();
      setGrantedState({
        notifications: res.notifications,
        storage: res.storage,
        microphone: res.microphone,
        geolocation: res.geolocation,
      });
      localStorage.setItem('asrarhub_permissions_requested', 'true');
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    } catch (e) {
      console.warn('Error requesting all permissions:', e);
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

  const content = {
    fr: {
      stepHeader: 'Autorisation du Système',
      allowBtn: 'Autoriser',
      denyBtn: 'Ne pas autoriser',
      grantAllBtn: 'Tout autoriser',
      skipBtn: 'Plus tard dans les paramètres',
      viewAllBtn: 'Voir toutes les autorisations',
      secureNotice: 'Vos données restent 100% privées et sécurisées sur votre appareil.',
      notifications: {
        title: 'Autoriser AsrarHub à vous envoyer des notifications ?',
        desc: 'Pour recevoir les rappels d\'heures planétaires, Sa\'ah al-Ijābah et vos Zikrs quotidiens.',
        icon: Bell,
        color: 'text-indigo-500 bg-indigo-500/10'
      },
      storage: {
        title: 'Autoriser AsrarHub à accéder au stockage et aux fichiers ?',
        desc: 'Pour sauvegarder le cache hors-ligne, les parchemins et vos journaux spirituels.',
        icon: HardDrive,
        color: 'text-amber-500 bg-amber-500/10'
      },
      microphone: {
        title: 'Autoriser AsrarHub à utiliser le microphone ?',
        desc: 'Pour le compteur de Zikr vocal automatique et la détection des récitations.',
        icon: Mic,
        color: 'text-rose-500 bg-rose-500/10'
      },
      geolocation: {
        title: 'Autoriser AsrarHub à accéder à la position de cet appareil ?',
        desc: 'Pour le calcul précis de la Qibla, des heures de prière et des heures planétaires.',
        icon: MapPin,
        color: 'text-emerald-500 bg-emerald-500/10'
      }
    },
    ha: {
      stepHeader: 'Izinodins Tsarin Na\'ura',
      allowBtn: 'Bada Izin',
      denyBtn: 'Kada ka bada izin',
      grantAllBtn: 'Bada Dukkan Izinodi',
      skipBtn: 'Daga baya a saitin',
      viewAllBtn: 'Duba dukkan izinodi',
      secureNotice: 'Bayanan ku suna sirri 100% akan na\'urar ku.',
      notifications: {
        title: 'Tura sanarwa ta AsrarHub zuwa gare ku?',
        desc: 'Don samun tunatarwar sa\'o\'in taurari da Zikiri na yau da kullun.',
        icon: Bell,
        color: 'text-indigo-500 bg-indigo-500/10'
      },
      storage: {
        title: 'Bada damar adana fayiloli da sauran bayanai ga AsrarHub?',
        desc: 'Don adana kayayyakin manhaja da bayanan sirri a bango.',
        icon: HardDrive,
        color: 'text-amber-500 bg-amber-500/10'
      },
      microphone: {
        title: 'Bada damar yin amfani da maikirfoni da sauti ga AsrarHub?',
        desc: 'Don ƙididdigar Zikiri ta hanyar murya.',
        icon: Mic,
        color: 'text-rose-500 bg-rose-500/10'
      },
      geolocation: {
        title: 'Bada damar samun wurin GPS ga AsrarHub?',
        desc: 'Don lissafin alƙibla da lokutan addu\'a daidai.',
        icon: MapPin,
        color: 'text-emerald-500 bg-emerald-500/10'
      }
    },
    en: {
      stepHeader: 'System Permissions',
      allowBtn: 'Allow',
      denyBtn: "Don't allow",
      grantAllBtn: 'Grant All Permissions',
      skipBtn: 'Later in settings',
      viewAllBtn: 'View all permissions',
      secureNotice: 'Your data remains 100% private and secure on your device.',
      notifications: {
        title: 'Allow AsrarHub to send you notifications?',
        desc: 'To receive planetary hour alerts, Sa\'ah al-Ijābah, and daily Zikr reminders.',
        icon: Bell,
        color: 'text-indigo-500 bg-indigo-500/10'
      },
      storage: {
        title: 'Allow AsrarHub to access photos, media and files on your device?',
        desc: 'To save offline cache, parchments, and spiritual journal entries.',
        icon: HardDrive,
        color: 'text-amber-500 bg-amber-500/10'
      },
      microphone: {
        title: 'Allow AsrarHub to record audio using the microphone?',
        desc: 'For automated voice Zikr counting and recitation audio analysis.',
        icon: Mic,
        color: 'text-rose-500 bg-rose-500/10'
      },
      geolocation: {
        title: 'Allow AsrarHub to access this device\'s location?',
        desc: 'For precise Qibla direction, prayer times, and planetary calculations.',
        icon: MapPin,
        color: 'text-emerald-500 bg-emerald-500/10'
      }
    }
  };

  const t = content[language as keyof typeof content] || content.fr;
  const currentKey = permissionList[currentStepIndex];
  const currentStep = t[currentKey];
  const StepIcon = currentStep.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm sm:max-w-md w-full shadow-2xl overflow-hidden relative"
          >
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                {t.stepHeader} ({currentStepIndex + 1}/4)
              </span>
              <button
                onClick={() => setViewMode(prev => (prev === 'step' ? 'list' : 'step'))}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium cursor-pointer"
              >
                {viewMode === 'step' ? t.viewAllBtn : 'Guide pas à pas'}
              </button>
            </div>

          {viewMode === 'step' ? (
            /* Native System Dialog Card UI */
            <div className="py-2 text-center flex flex-col items-center">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-5 ${currentStep.color}`}>
                <StepIcon className="w-8 h-8" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug px-2">
                {currentStep.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 px-3">
                {currentStep.desc}
              </p>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-1.5 mb-6">
                {permissionList.map((key, idx) => (
                  <div
                    key={key}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStepIndex
                        ? 'w-6 bg-emerald-500'
                        : grantedState[key] === true
                        ? 'w-2 bg-emerald-400'
                        : grantedState[key] === false
                        ? 'w-2 bg-rose-400'
                        : 'w-2 bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Action Buttons matching OS Dialogs */}
              <div className="w-full space-y-2.5">
                <button
                  onClick={() => handleRequestSingle(currentKey, true)}
                  disabled={isRequesting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isRequesting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : null}
                  <span>{t.allowBtn}</span>
                </button>

                <button
                  onClick={() => handleRequestSingle(currentKey, false)}
                  disabled={isRequesting}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all cursor-pointer"
                >
                  {t.denyBtn}
                </button>
              </div>
            </div>
          ) : (
            /* List / Overview Mode */
            <div className="space-y-3 my-2">
              {permissionList.map((key) => {
                const item = t[key];
                const ItemIcon = item.icon;
                const state = grantedState[key];

                return (
                  <div
                    key={key}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex items-start gap-3"
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                      <ItemIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {key === 'notifications' ? 'Notifications Push' : key === 'storage' ? 'Stockage & Fichiers' : key === 'microphone' ? 'Microphone & Audio' : 'Localisation GPS'}
                        </h4>
                        {state === true && (
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3" /> Autorisé
                          </span>
                        )}
                        {state === false && (
                          <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full shrink-0">
                            Refusé
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="pt-3 space-y-2">
                <button
                  onClick={handleGrantAll}
                  disabled={isRequesting}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isRequesting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span>{t.grantAllBtn}</span>
                </button>

                <button
                  onClick={handleSkip}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer text-center"
                >
                  {t.skipBtn}
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.secureNotice}</span>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

