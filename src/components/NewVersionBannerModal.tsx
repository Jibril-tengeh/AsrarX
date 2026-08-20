import React, { useState } from 'react';
import { appVersionService } from '../services/appVersionService';
import { APP_VERSION_CONFIG } from '../config/appVersion';
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

  if (!isOpen) return null;

  const handleDismissOnly = () => {
    appVersionService.markVersionInstalled(currentVersion);
    onDismiss();
  };

  const latestReleaseRaw = APP_VERSION_CONFIG.releases.find((r) => r.version === currentVersion) || APP_VERSION_CONFIG.releases[0];

  return (
    <>
      <UpdateVideoCardModal
        isOpen={isOpen && !showChangelog}
        targetRelease={latestReleaseRaw}
        currentInstalledVersion={previousVersion || currentVersion}
        isForceUpdate={false}
        initialThemeId="cosmic-nebula"
        onDismiss={handleDismissOnly}
      />

      {/* Changelog detailed modal if requested */}
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

