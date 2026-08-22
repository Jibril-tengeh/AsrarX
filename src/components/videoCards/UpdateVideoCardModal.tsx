import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  RefreshCw, 
  Share2, 
  Check, 
  Download
} from 'lucide-react';
import { getPresetById, VideoCardThemeId } from '../../types/updateCards';
import { UpdateVideoCard } from './UpdateVideoCard';
import { VersionRelease } from '../../config/appVersion';
import { useLanguage } from '../../contexts/LanguageContext';
import { appVersionService } from '../../services/appVersionService';

interface UpdateVideoCardModalProps {
  isOpen: boolean;
  targetRelease: VersionRelease;
  currentInstalledVersion: string;
  isForceUpdate?: boolean;
  initialThemeId?: VideoCardThemeId;
  onDismiss: () => void;
  onRefreshCache?: () => void;
}

export const UpdateVideoCardModal: React.FC<UpdateVideoCardModalProps> = ({
  isOpen,
  targetRelease,
  currentInstalledVersion,
  isForceUpdate = false,
  initialThemeId = 'cyber-emerald',
  onDismiss,
  onRefreshCache
}) => {
  const { language } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStep, setRefreshStep] = useState<string | null>(null);

  if (!isOpen) return null;

  // Selected theme is strictly defined by Admin in targetRelease or fallback to default
  const selectedThemeId: VideoCardThemeId = targetRelease.videoCardTheme || initialThemeId || 'cyber-emerald';
  const currentPreset = getPresetById(selectedThemeId);

  const handleCopyApkLink = () => {
    const url = targetRelease.apkDownloadUrl || targetRelease.downloadUrl || window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCleanCache = async () => {
    setIsRefreshing(true);
    setRefreshStep(language === 'fr' ? 'Nettoyage des données et rechargement...' : 'Refreshing data and cache...');
    try {
      if (onRefreshCache) {
        onRefreshCache();
      } else {
        await appVersionService.flushAndUpgradeCaches((step) => setRefreshStep(step));
        setTimeout(() => {
          setIsRefreshing(false);
          window.location.reload();
        }, 1000);
      }
    } catch {
      setIsRefreshing(false);
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="asrarhub-video-update-popup-overlay"
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-xl my-auto flex flex-col items-center"
        >
          {/* Top Bar with Close button if not forced */}
          {!isForceUpdate && (
            <div className="w-full flex items-center justify-end mb-2">
              <button
                type="button"
                onClick={onDismiss}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all text-xs font-semibold backdrop-blur-md cursor-pointer border border-white/10"
                title="Fermer la fenêtre"
              >
                <X size={15} />
                <span>{language === 'fr' ? 'Fermer' : 'Close'}</span>
              </button>
            </div>
          )}

          {/* Master Video Card (Single Admin-Defined Theme) */}
          <UpdateVideoCard
            preset={currentPreset}
            targetRelease={targetRelease}
            currentInstalledVersion={currentInstalledVersion}
            isForceUpdate={isForceUpdate}
            onSecondaryAction={handleCleanCache}
            secondaryActionLabel={
              isRefreshing 
                ? (refreshStep || (language === 'fr' ? 'Actualisation...' : 'Refreshing...'))
                : (language === 'fr' ? 'Actualiser le Cache SWR & Recharger' : 'Refresh Cache & Reload')
            }
          />

          {/* Footer Quick Links & Share */}
          <div className="w-full flex items-center justify-between gap-3 mt-3 px-2 text-xs text-gray-400">
            <button
              type="button"
              onClick={handleCopyApkLink}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5"
            >
              {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
              <span>{copiedLink ? (language === 'fr' ? 'Lien copié !' : 'Link copied!') : (language === 'fr' ? 'Copier le lien APK' : 'Copy APK Link')}</span>
            </button>

            {!isForceUpdate && (
              <button
                type="button"
                onClick={onDismiss}
                className="hover:text-white transition-colors underline cursor-pointer"
              >
                {language === 'fr' ? 'Continuer sans mettre à jour' : 'Skip for now'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
