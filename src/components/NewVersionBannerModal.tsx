import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, X, Layers } from 'lucide-react';
import { appVersionService } from '../services/appVersionService';
import { APP_VERSION_CONFIG, VersionRelease } from '../config/appVersion';
import { ChangelogModal } from './ChangelogModal';
import { Version3DVideoNotificationModal } from './videoCards/Version3DVideoNotificationModal';
import { checkVersionAndPurgeCache } from '../App';

interface NewVersionBannerModalProps {
  isOpen: boolean;
  currentVersion: string;
  previousVersion: string | null;
  onDismiss: () => void;
  onForceRefresh?: () => void;
}

export const NewVersionBannerModal: React.FC<NewVersionBannerModalProps> = ({
  isOpen,
  currentVersion,
  previousVersion,
  onDismiss,
  onForceRefresh
}) => {
  const [showChangelog, setShowChangelog] = useState(false);
  const [activeReleases, setActiveReleases] = useState<VersionRelease[]>(APP_VERSION_CONFIG.releases);
  const [isForceRefreshing, setIsForceRefreshing] = useState(false);

  useEffect(() => {
    const unsub = appVersionService.subscribeReleases((releases) => {
      if (releases && releases.length > 0) {
        setActiveReleases(releases);
      }
    }, false);
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleDismissOnly = () => {
    appVersionService.markVersionInstalled(currentVersion);
    appVersionService.markVersionNotified(currentVersion);
    onDismiss();
  };

  const handleForceRefresh = async () => {
    setIsForceRefreshing(true);
    appVersionService.markVersionInstalled(currentVersion);
    appVersionService.markVersionNotified(currentVersion);
    try {
      if (onForceRefresh) {
        onForceRefresh();
      } else {
        console.log('[NewVersionBannerModal] Executing checkVersionAndPurgeCache(true)...');
        await checkVersionAndPurgeCache(true);
      }
    } catch (err) {
      console.warn('[NewVersionBannerModal] Error running forced cache purge:', err);
    } finally {
      window.location.reload();
    }
  };

  const targetRelease = activeReleases.find((r) => r.version === currentVersion) || activeReleases[0] || APP_VERSION_CONFIG.releases[0];
  
  // 3D Video Modal is enabled by default unless admin explicitly toggled disableVideoCard or enable3DVideoPopup === false
  const is3DVideoEnabled = targetRelease.enable3DVideoPopup !== false && !targetRelease.disableVideoCard;

  return (
    <>
      {/* Centered 3D Video Professional Notification Modal */}
      {is3DVideoEnabled ? (
        <Version3DVideoNotificationModal
          isOpen={isOpen && !showChangelog}
          targetRelease={targetRelease}
          currentInstalledVersion={currentVersion}
          previousVersion={previousVersion}
          isForceUpdate={targetRelease.forceVideoModal || targetRelease.forceUpdate || false}
          onDismiss={handleDismissOnly}
          onForceRefresh={handleForceRefresh}
        />
      ) : (
        /* Compact Floating Banner when admin explicitly disabled 3D video card */
        <div 
          id="asrarhub-force-refresh-floating-bar"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100000] max-w-xl w-[94%] sm:w-auto flex items-center justify-between sm:justify-start gap-2 sm:gap-3 bg-gray-950/95 text-white px-3.5 sm:px-4 py-2.5 rounded-2xl border border-emerald-500/40 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-gray-200">
              {previousVersion ? `v${previousVersion} → v${currentVersion}` : `Version v${currentVersion}`}
            </span>
          </div>

          <div className="h-4 w-px bg-white/20 hidden sm:block" />

          <button
            type="button"
            onClick={() => setShowChangelog(true)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer"
          >
            Nouveautés
          </button>

          <button
            id="btn-force-refresh-modal"
            type="button"
            onClick={handleForceRefresh}
            disabled={isForceRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-60 whitespace-nowrap"
            title="Vider tous les caches IndexedDB et recharger l'application"
          >
            <RefreshCw size={13} className={isForceRefreshing ? 'animate-spin' : ''} />
            <span>{isForceRefreshing ? 'Nettoyage...' : 'Force Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={handleDismissOnly}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-xs leading-none"
            title="Fermer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Changelog detailed modal */}
      <ChangelogModal
        isOpen={showChangelog}
        onClose={() => {
          setShowChangelog(false);
          handleDismissOnly();
        }}
        initialSelectedVersion={currentVersion}
      />
    </>
  );
};


