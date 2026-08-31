import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PromoAnnouncement } from '../../types/promoAnnouncement';
import { promoAnnouncementService } from '../../services/promoAnnouncementService';
import { PromoVideoCard } from './PromoVideoCard';

interface PromoVideoModalProps {
  forcedAnnouncement?: PromoAnnouncement | null;
  isOpen?: boolean;
  onClose?: () => void;
  isPreview?: boolean;
}

export const PromoVideoModal: React.FC<PromoVideoModalProps> = ({
  forcedAnnouncement,
  isOpen: forcedIsOpen,
  onClose: forcedOnClose,
  isPreview = false
}) => {
  const [announcement, setAnnouncement] = useState<PromoAnnouncement | null>(
    forcedAnnouncement || (isPreview ? promoAnnouncementService.getCachedAnnouncement() : null)
  );
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (forcedAnnouncement) {
      setAnnouncement(forcedAnnouncement);
      return;
    }

    const unsub = promoAnnouncementService.subscribeActiveAnnouncement((data) => {
      if (data && data.isActive && data.showAsModal) {
        setAnnouncement(data);
        if (!isPreview) {
          const dismissed = promoAnnouncementService.isPopupDismissedToday(data.promoCode);
          if (!dismissed) {
            // Small delay for smooth entry after initial page load
            const timer = setTimeout(() => {
              setInternalIsOpen(true);
            }, 1200);
            return () => clearTimeout(timer);
          }
        }
      } else {
        // Announcement is not published or turned off by admin
        setAnnouncement(data || null);
        if (!isPreview && forcedIsOpen === undefined) {
          setInternalIsOpen(false);
        }
      }
    });

    return () => unsub();
  }, [forcedAnnouncement, isPreview, forcedIsOpen]);

  const isOpen = forcedIsOpen !== undefined ? forcedIsOpen : internalIsOpen;

  const handleClose = () => {
    if (!isPreview && announcement?.promoCode) {
      promoAnnouncementService.markPopupDismissed(announcement.promoCode);
    }
    if (forcedOnClose) {
      forcedOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  // If not in preview or forced mode, ensure announcement is explicitly active before showing
  if (!isOpen || !announcement) return null;
  if (!isPreview && forcedIsOpen === undefined && !announcement.isActive) return null;

  return (
    <AnimatePresence>
      <div 
        id="asrarhub-promo-video-modal-backdrop"
        className="fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-5 bg-gray-950/85 backdrop-blur-md overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <PromoVideoCard
            announcement={announcement}
            showCloseButton={true}
            onClose={handleClose}
            onApplyCode={(code) => {
              handleClose();
              window.location.href = `/payment?code=${encodeURIComponent(code.trim().toUpperCase())}`;
            }}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
