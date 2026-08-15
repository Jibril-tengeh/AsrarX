import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  initNotificationRouter, 
  subscribeNotificationRouter, 
  NotificationRouterAction,
  PlanetaryModalData
} from '../../utils/notificationRouter';
import { DownloadRecord } from '../../utils/downloadStorage';
import { DownloadedItemModal } from './DownloadedItemModal';
import { PlanetaryHourDetailModal } from './PlanetaryHourDetailModal';

export const NotificationModalManager: React.FC = () => {
  const navigate = useNavigate();

  const [downloadModalOpen, setDownloadModalOpen] = useState<boolean>(false);
  const [currentDownloadItem, setCurrentDownloadItem] = useState<DownloadRecord | null>(null);

  const [planetaryModalOpen, setPlanetaryModalOpen] = useState<boolean>(false);
  const [currentPlanetaryData, setCurrentPlanetaryData] = useState<PlanetaryModalData | null>(null);

  useEffect(() => {
    // Initialize Capacitor and Web listeners
    initNotificationRouter();

    // Subscribe to router actions
    const unsubscribe = subscribeNotificationRouter((action: NotificationRouterAction) => {
      if (action.type === 'OPEN_DOWNLOAD') {
        setCurrentDownloadItem(action.payload);
        setDownloadModalOpen(true);
      } else if (action.type === 'OPEN_PLANETARY') {
        setCurrentPlanetaryData(action.payload);
        setPlanetaryModalOpen(true);
      } else if (action.type === 'NAVIGATE') {
        if (action.path) {
          navigate(action.path, { state: action.state });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <>
      <DownloadedItemModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        initialItem={currentDownloadItem}
      />

      <PlanetaryHourDetailModal
        isOpen={planetaryModalOpen}
        onClose={() => setPlanetaryModalOpen(false)}
        initialData={currentPlanetaryData}
      />
    </>
  );
};
