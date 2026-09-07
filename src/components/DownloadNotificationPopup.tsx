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
    <AnimatePresence>
      {notification && (
        <motion.div
          key={`dl-popup-notif-${notification.id || notification.fileName || 'active'}`}
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-md pointer-events-auto"
        >
          <div
            onClick={notification.type === 'success' ? handleOpenPreview : undefined}
            className={`relative overflow-hidden p-4 rounded-3xl border shadow-2xl backdrop-blur-xl transition-all ${
              notification.type === 'success' ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''
            } ${
              notification.type === 'start'
                ? 'bg-amber-950/90 dark:bg-amber-950/95 border-amber-500/40 text-amber-100 shadow-amber-900/30'
                : notification.type === 'success'
                ? 'bg-emerald-950/95 dark:bg-emerald-950/95 border-emerald-500/50 text-emerald-100 shadow-emerald-900/40 ring-1 ring-emerald-400/30'
                : 'bg-red-950/90 dark:bg-red-950/95 border-red-500/40 text-red-100 shadow-red-900/30'
            }`}
          >
          {/* Ambient Glow Background */}
          <div
            className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-30 ${
              notification.type === 'start'
                ? 'bg-amber-400'
                : notification.type === 'success'
                ? 'bg-emerald-400'
                : 'bg-red-400'
            }`}
          />

          <div className="relative flex items-center gap-3.5">
            {/* Status Icon or Image Thumbnail */}
            {notification.type === 'success' && notification.dataUrl && notification.dataUrl.startsWith('data:image') ? (
              <img
                src={notification.dataUrl}
                alt="preview"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400/50 bg-black/60 shrink-0 shadow-md"
              />
            ) : (
              <div
                className={`p-2.5 rounded-2xl shrink-0 flex items-center justify-center border ${
                  notification.type === 'start'
                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                    : notification.type === 'success'
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/20 border-red-500/30 text-red-400'
                }`}
              >
                {notification.type === 'start' && <Loader2 className="w-5 h-5 animate-spin" />}
                {notification.type === 'success' && <FileCheck className="w-5 h-5 text-emerald-400" />}
                {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm tracking-tight">{getTitle()}</h4>
                {notification.type === 'start' && (
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {language === 'ha' ? 'Ana Ciki' : language === 'en' ? 'In Progress' : 'En cours'}
                  </span>
                )}
                {notification.type === 'success' && (
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {language === 'fr' ? 'Cliquer pour voir' : 'Click to view'}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-300/90 mt-1 leading-relaxed break-words font-medium line-clamp-2">
                {getMessage()}
              </p>

              {/* Action Button for Success */}
              {notification.type === 'success' && (
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPreview();
                    }}
                    className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-[11px] flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>{language === 'fr' ? 'Visualiser l\'image' : language === 'ha' ? 'Duba Hoton' : 'View Image'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotification(null);
              }}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Animated Loading Bar at bottom for 'start' */}
          {notification.type === 'start' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-900/40 overflow-hidden">
              <motion.div
                className="h-full bg-amber-400"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              />
            </div>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
};
