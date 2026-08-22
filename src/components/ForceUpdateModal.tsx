import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DownloadCloud, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink, 
  RefreshCw, 
  Smartphone, 
  ShieldAlert, 
  CheckCircle2,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { VersionRelease, APP_VERSION_CONFIG, getLocalizedRelease } from '../config/appVersion';
import { appVersionService } from '../services/appVersionService';
import { getPresetById, VideoCardThemeId } from '../types/updateCards';
import { UpdateVideoCard } from './videoCards/UpdateVideoCard';

interface ForceUpdateModalProps {
  currentInstalledVersion: string;
  currentInstalledVersionCode: number;
}

export const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({
  currentInstalledVersion,
  currentInstalledVersionCode,
}) => {
  const { language } = useLanguage();
  const [activeReleases, setActiveReleases] = useState<VersionRelease[]>(APP_VERSION_CONFIG.releases);
  const [isUpdatingCache, setIsUpdatingCache] = useState(false);
  const [updateStatusStep, setUpdateStatusStep] = useState<string | null>(null);

  // Subscribe to real-time version releases from Firestore
  useEffect(() => {
    const unsubscribe = appVersionService.subscribeReleases((releases) => {
      setActiveReleases(releases);
    }, false); // Only public active releases

    return () => unsubscribe();
  }, []);

  // Determine if a forced update is required:
  const latestRelease = activeReleases.length > 0 ? activeReleases[0] : APP_VERSION_CONFIG.releases[0];
  
  const forcedRelease = activeReleases.find((r) => {
    if (!r.forceUpdate) return false;
    const requiredMinCode = r.minSupportedVersionCode || r.versionCode;
    return currentInstalledVersionCode < requiredMinCode || currentInstalledVersion !== r.version;
  }) || (latestRelease?.forceUpdate && (currentInstalledVersionCode < (latestRelease.minSupportedVersionCode || latestRelease.versionCode) || currentInstalledVersion !== latestRelease.version) ? latestRelease : null);

  // If no forced update applies, do not render anything
  if (!forcedRelease) {
    return null;
  }

  // Selected theme is strictly defined by Admin in forcedRelease or fallback to default
  const selectedThemeId: VideoCardThemeId = forcedRelease.videoCardTheme || 'cyber-emerald';
  const currentPreset = getPresetById(selectedThemeId);

  const handleClearCacheAndReload = async () => {
    setIsUpdatingCache(true);
    setUpdateStatusStep(
      language === 'fr'
        ? "Purge des caches locaux et resynchronisation..."
        : language === 'ha'
        ? "Ana share cache da daidaita sabon siga..."
        : "Clearing local caches and synchronizing..."
    );

    try {
      await appVersionService.flushAndUpgradeCaches((step) => {
        setUpdateStatusStep(step);
      });
      setTimeout(() => {
        setIsUpdatingCache(false);
        window.location.reload();
      }, 1200);
    } catch (e) {
      console.warn("Cache flush error:", e);
      setIsUpdatingCache(false);
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="asrarhub-force-update-overlay"
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-gray-950/92 backdrop-blur-xl select-none overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg my-auto flex flex-col items-center"
        >
          {/* Top Bar with Security Badge */}
          <div className="w-full flex items-center justify-between gap-2 mb-3 bg-gray-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-500/30 shadow-lg text-white">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-amber-400 animate-pulse" />
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                {language === 'fr' ? 'Mise à jour obligatoire' : language === 'ha' ? 'Sabuntawa ta Dole' : 'Mandatory Update'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-gray-400">
              v{forcedRelease.version}
            </span>
          </div>

          {/* Master Dynamic Video Card (Single Admin-Defined Theme) */}
          <UpdateVideoCard
            preset={currentPreset}
            targetRelease={forcedRelease}
            currentInstalledVersion={currentInstalledVersion}
            isForceUpdate={true}
            onSecondaryAction={handleClearCacheAndReload}
            secondaryActionLabel={
              isUpdatingCache
                ? (updateStatusStep || (language === 'fr' ? 'Actualisation...' : 'Refreshing...'))
                : (language === 'fr' ? 'Recharger & Purger le Cache' : 'Reload & Re-check')
            }
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
