import React, { useState, useEffect } from 'react';
import { appVersionService } from '../services/appVersionService';
import { APP_VERSION_CONFIG, VersionRelease } from '../config/appVersion';
import { ChangelogModal } from './ChangelogModal';
import { UpdateVideoCardModal } from './videoCards/UpdateVideoCardModal';

interface NewVersionBannerModalProps {
  isOpen: boolean;
  currentVersion: string;
  previousVersion: string | null;
  onDismiss: () => void;
}

export const NewVersionBannerModal: React.FC<NewVersionBannerModalProps> = ({
  isOpen,
  currentVersion,
  previousVersion,
  onDismiss
}) => {
  const [showChangelog, setShowChangelog] = useState(false);
  const [activeReleases, setActiveReleases] = useState<VersionRelease[]>(APP_VERSION_CONFIG.releases);

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
    onDismiss();
  };

  const targetRelease = activeReleases.find((r) => r.version === currentVersion) || activeReleases[0] || APP_VERSION_CONFIG.releases[0];
  const isVideoCardDisabled = !!targetRelease?.disableVideoCard;

  return (
    <>
      {!isVideoCardDisabled && (
        <UpdateVideoCardModal
          isOpen={isOpen && !showChangelog}
          targetRelease={targetRelease}
          currentInstalledVersion={previousVersion || currentVersion}
          isForceUpdate={false}
          initialThemeId={targetRelease.videoCardTheme || 'cyber-emerald'}
          onDismiss={handleDismissOnly}
        />
      )}

      {/* Changelog detailed modal if requested or if video card is disabled by admin */}
      <ChangelogModal
        isOpen={showChangelog || (isOpen && isVideoCardDisabled)}
        onClose={() => {
          setShowChangelog(false);
          handleDismissOnly();
        }}
        initialSelectedVersion={currentVersion}
      />
    </>
  );
};

