import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Tag, Sparkles, ArrowRight, Gift, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { PromoAnnouncement } from '../../types/promoAnnouncement';
import { promoAnnouncementService } from '../../services/promoAnnouncementService';
import { PromoVideoCard } from './PromoVideoCard';
import { useLanguage } from '../../contexts/LanguageContext';

interface PromoAnnouncementBannerProps {
  pageLocation?: 'all' | 'home' | 'store' | 'payment';
  onApplyCode?: (code: string) => void;
  className?: string;
}

export const PromoAnnouncementBanner: React.FC<PromoAnnouncementBannerProps> = ({
  pageLocation = 'all',
  onApplyCode,
  className = ''
}) => {
  const { language } = useLanguage();
  const [announcement, setAnnouncement] = useState<PromoAnnouncement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = promoAnnouncementService.subscribeActiveAnnouncement((data) => {
      if (data && data.isActive && data.showInBanner) {
        if (!data.targetPages || data.targetPages.includes('all') || data.targetPages.includes(pageLocation)) {
          setAnnouncement(data);
          return;
        }
      }
      setAnnouncement(null);
    });
    return () => unsub();
  }, [pageLocation]);

  if (!announcement || !announcement.isActive) return null;

  const title = language === 'fr'
    ? announcement.titleFr
    : language === 'ha'
    ? (announcement.titleHa || announcement.titleFr)
    : (announcement.titleEn || announcement.titleFr);

  const benefit = language === 'fr'
    ? announcement.benefitFr
    : language === 'ha'
    ? (announcement.benefitHa || announcement.benefitFr)
    : (announcement.benefitEn || announcement.benefitFr);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(announcement.promoCode.trim().toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-950/60 shadow-lg ${className}`}>
      {/* Collapsed Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer hover:bg-white/5 transition-all"
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Gift size={20} className="animate-bounce" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-gray-950 px-2 py-0.5 rounded-full">
                {announcement.badgeFr || 'OFFRE VIP'}
              </span>
              {benefit && (
                <span className="text-xs font-bold text-amber-300 truncate">
                  {benefit}
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-white truncate mt-0.5">
              {title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Quick Copy Badge */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 font-mono text-xs font-bold border border-amber-400/30 transition-all active:scale-95"
          >
            <Tag size={13} />
            <span>{announcement.promoCode.toUpperCase()}</span>
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>

          {/* Toggle Video Card Expand */}
          <div className="flex items-center gap-1 text-xs text-purple-300 font-bold hover:text-white">
            <span>{isExpanded ? 'Masquer vidéo' : 'Voir la vidéo'}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {/* Expanded Video Card */}
      {isExpanded && (
        <div className="p-3 sm:p-4 border-t border-white/10 bg-black/40">
          <div className="max-w-lg mx-auto">
            <PromoVideoCard 
              announcement={announcement}
              onApplyCode={onApplyCode}
            />
          </div>
        </div>
      )}
    </div>
  );
};
