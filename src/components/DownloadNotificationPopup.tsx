import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  FileCheck, 
  Eye, 
  ExternalLink 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  subscribeDownloadNotification, 
  DownloadEventData, 
  openDownloadPreviewModal 
} from '../utils/downloadNotification';

interface ActiveNotification extends DownloadEventData {}

export const DownloadNotificationPopup: React.FC = () => {
  const { language } = useLanguage();
  const [notification, setNotification] = useState<ActiveNotification | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeDownloadNotification((event: DownloadEventData) => {
      setNotification(event);

      // Auto dismiss success or error after 6 seconds
      if (event.type === 'success' || event.type === 'error') {
        const timer = setTimeout(() => {
          setNotification((current) => (current?.id === event.id ? null : current));
        }, 6000);
        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribe();
  }, []);

  const getTitle = () => {
    if (!notification) return '';
    if (notification.type === 'start') {
      if (language === 'ha') return 'An Fara Zazzagewa';
      if (language === 'en') return 'Download Started';
      return 'Téléchargement Démarré';
    }
    if (notification.type === 'success') {
      if (language === 'ha') return 'An Kammala Zazzagewa';
      if (language === 'en') return 'Download Completed';
      return 'Téléchargement Terminé';
    }
    if (language === 'ha') return 'Zazzagewa Ta Gaza';
    if (language === 'en') return 'Download Failed';
    return 'Échec du Téléchargement';
  };

  const getMessage = () => {
    if (!notification) return '';
    if (notification.customMessage) return notification.customMessage;

    if (notification.type === 'start') {
      const name = notification.fileName ? ` (${notification.fileName})` : '';
      if (language === 'ha') return `Fitar da fayil ɗinku na ci gaba...${name}`;
      if (language === 'en') return `Exporting your file in background...${name}`;
      return `Génération et sauvegarde de votre fichier en cours...${name}`;
    }
    if (notification.type === 'success') {
      if (language === 'ha') return "An adana hoto/fayil ɗinku cikin nasara. Danna domin gani.";
      if (language === 'en') return 'Your file has been saved. Click to view image.';
      return 'Votre fichier a été enregistré. Cliquez pour voir l\'image.';
    }
    if (language === 'ha') return 'Akwai matsala wajen adana fayil ɗin.';
    if (language === 'en') return 'An error occurred while saving the file.';
    return 'Une erreur est survenue lors du téléchargement du fichier.';
  };

  const handleOpenPreview = () => {
    if (notification && notification.type === 'success') {
      openDownloadPreviewModal(notification);
      setNotification(null);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {notification && (
        <motion.div
          key={`dl-popup-wrapper-${notification.id || 'notif'}-${notification.type}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99998] flex items-center justify-center p-4 pointer-events-none"
        >
          {/* Subtle Dim Backdrop for Focus */}
          <div
            onClick={() => setNotification(null)}
            className="absolute inset-0 bg-black/45 backdrop-blur-[3px] pointer-events-auto"
          />

          {/* Centered Professional Rectangular Notification Card */}
          <motion.div
            key={`dl-popup-card-${notification.id || 'notif'}-${notification.type}`}
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="relative z-10 w-full max-w-md pointer-events-auto"
          >
            <div
              onClick={notification.type === 'success' ? handleOpenPreview : undefined}
              className={`relative overflow-hidden p-5 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all ${
                notification.type === 'success' ? 'cursor-pointer hover:border-emerald-400/60' : ''
              } ${
                notification.type === 'start'
                  ? 'bg-slate-900/95 dark:bg-slate-950/95 border-amber-500/40 text-amber-50 shadow-amber-950/50'
                  : notification.type === 'success'
                  ? 'bg-slate-900/98 dark:bg-slate-950/98 border-emerald-500/50 text-emerald-50 shadow-emerald-950/50 ring-1 ring-emerald-500/20'
                  : 'bg-slate-900/95 dark:bg-slate-950/95 border-red-500/40 text-red-50 shadow-red-950/50'
              }`}
            >
              {/* Subtle Ambient Corner Accent */}
              <div
                className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-25 ${
                  notification.type === 'start'
                    ? 'bg-amber-400'
                    : notification.type === 'success'
                    ? 'bg-emerald-400'
                    : 'bg-red-400'
                }`}
              />

              {/* Header row: Status Icon + Title + Close Button */}
              <div className="relative flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status Icon or Image Thumbnail */}
                  {notification.type === 'success' && notification.dataUrl && notification.dataUrl.startsWith('data:image') ? (
                    <img
                      src={notification.dataUrl}
                      alt="preview"
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-400/50 bg-black/60 shrink-0 shadow-md"
                    />
                  ) : (
                    <div
                      className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center border shadow-sm ${
                        notification.type === 'start'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                          : notification.type === 'success'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : 'bg-red-500/15 border-red-500/30 text-red-400'
                      }`}
                    >
                      {notification.type === 'start' && <Loader2 className="w-5 h-5 animate-spin" />}
                      {notification.type === 'success' && <FileCheck className="w-5 h-5 text-emerald-400" />}
                      {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight truncate">
                        {getTitle()}
                      </h4>
                      {notification.type === 'start' && (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {language === 'ha' ? 'Ana Ciki' : language === 'en' ? 'In Progress' : 'En cours'}
                        </span>
                      )}
                      {notification.type === 'success' && (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {language === 'fr' ? 'Succès' : language === 'ha' ? 'Nassara' : 'Success'}
                        </span>
                      )}
                    </div>
                    {notification.fileName && (
                      <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5 max-w-[240px] sm:max-w-xs">
                        {notification.fileName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotification(null);
                  }}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body Message */}
              <p className="relative text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-normal mb-4">
                {getMessage()}
              </p>

              {/* Action Buttons */}
              <div className="relative flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotification(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {language === 'fr' ? 'Fermer' : language === 'ha' ? 'Rufe' : 'Dismiss'}
                </button>

                {notification.type === 'success' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPreview();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>{language === 'fr' ? "Visualiser l'image" : language === 'ha' ? 'Duba Hoton' : 'View Image'}</span>
                  </button>
                )}
              </div>

              {/* Animated Progress Bar at bottom for 'start' */}
              {notification.type === 'start' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-950/60 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
