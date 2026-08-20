import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Share2, 
  Check, 
  Download,
  Layers
} from 'lucide-react';
import { VIDEO_CARD_PRESETS, getPresetById, VideoCardThemeId } from '../../types/updateCards';
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
  const [selectedThemeId, setSelectedThemeId] = useState<VideoCardThemeId>(initialThemeId);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStep, setRefreshStep] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPreset = getPresetById(selectedThemeId);
  const currentIndex = VIDEO_CARD_PRESETS.findIndex(p => p.id === selectedThemeId);

  const handlePrevPreset = () => {
    const nextIdx = (currentIndex - 1 + VIDEO_CARD_PRESETS.length) % VIDEO_CARD_PRESETS.length;
    setSelectedThemeId(VIDEO_CARD_PRESETS[nextIdx].id);
  };

  const handleNextPreset = () => {
    const nextIdx = (currentIndex + 1) % VIDEO_CARD_PRESETS.length;
    setSelectedThemeId(VIDEO_CARD_PRESETS[nextIdx].id);
  };

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
          {/* Top Control Bar & Theme Carousel Selector */}
          <div className="w-full flex items-center justify-between gap-2 mb-3 bg-gray-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg text-white">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-emerald-400" />
              <span className="text-xs font-bold text-gray-200">
                {language === 'fr' ? 'Style Vidéo :' : 'Video Style:'}
              </span>
              <span className="text-xs font-black text-amber-300 font-mono">
                {currentPreset.index}/10
              </span>
            </div>

            {/* Carousel navigation buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevPreset}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                title="Style vidéo précédent"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {VIDEO_CARD_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedThemeId(p.id)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      p.id === selectedThemeId
                        ? 'w-6 bg-white shadow-sm'
                        : 'bg-white/30 hover:bg-white/60'
                    }`}
                    title={p.titleFr}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextPreset}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                title="Style vidéo suivant"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Close modal if not forced */}
            {!isForceUpdate && (
              <button
                type="button"
                onClick={onDismiss}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer ml-1"
                title="Fermer la fenêtre"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Master Video Card */}
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
