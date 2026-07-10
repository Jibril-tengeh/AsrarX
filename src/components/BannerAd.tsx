import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useFeatures } from '../contexts/FeatureContext';
import { X, ExternalLink, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WatchAdModal } from './WatchAdModal';
import { admobService } from '../lib/admob';
import { earnPoints } from '../lib/points';

interface BannerAdProps {
  onClose?: () => void;
  className?: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({ onClose, className = "mb-1" }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { featureToggles } = useFeatures();
  const [isVisible, setIsVisible] = useState(true);
  const [isWatchAdOpen, setIsWatchAdOpen] = useState(false);

  // If the user has paid for the premium version, ads are deactivated immediately and completely.
  const isPremiumOrPro = user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro';
  
  // If ads are disabled globally for free users in the admin panel
  const adsEnabledForFree = featureToggles['adsEnabledForFree'] !== false;

  if (!isVisible || isPremiumOrPro || !adsEnabledForFree) {
    return null;
  }

  const pointsPerAd = featureToggles['pointsPerAd'] === undefined ? 10 : Number(featureToggles['pointsPerAd']);

  const handleWatchAd = async () => {
    if (!user) {
      setIsWatchAdOpen(true);
      return;
    }

    const wasShown = await admobService.showRewardedAd(
      async (earnedAmount) => {
        try {
          await earnPoints(user.uid, earnedAmount, `Visionnage publicité native AdMob`);
        } catch (err) {
          console.error("Error rewarding native ad points:", err);
        }
      },
      () => {
        console.log("Native ad dismissed");
      }
    );

    if (!wasShown) {
      setIsWatchAdOpen(true);
    }
  };

  // Replace points parameter in translated text if exists
  const pointsDesc = t('ad.pointsDesc', 'Visionnez une publicité de 15s pour obtenir +{points} pts et débloquer les articles de votre choix.')
    .replace('{points}', pointsPerAd.toString());

  return (
    <div className={`w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-3 sm:p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden group ${className}`}>
      <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="flex-1 z-10 text-center sm:text-left">
        <div className="text-[10px] uppercase tracking-wider font-bold text-white/50 mb-1 flex items-center justify-center sm:justify-start gap-1">
          <Sparkles size={10} className="text-amber-400" />
          <span>{t('ad.sponsored', 'Sponsorisé • Option Points')}</span>
        </div>
        <h4 className="font-bold text-base sm:text-lg mb-1">
          {t('ad.pointsTitle', 'Gagnez des Points Spirituels')}
        </h4>
        <p className="text-blue-100 text-xs sm:text-sm">
          {pointsDesc}
        </p>
      </div>
 
      <div className="flex items-center gap-2.5 z-10 w-full sm:w-auto shrink-0">
        <button
          onClick={handleWatchAd}
          className="flex-1 sm:flex-none text-center bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
        >
          <Play size={14} fill="currentColor" /> {t('ad.watchNow', 'Regarder la Pub')}
        </button>
        <Link 
          to="/payment" 
          className="flex-1 sm:flex-none text-center bg-white/10 text-white hover:bg-white/20 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1"
        >
          {t('ad.viewOffers', 'Premium')} <ExternalLink size={12} />
        </Link>
        <button 
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 transition-colors text-white"
          aria-label="Fermer l'annonce"
        >
          <X size={16} />
        </button>
      </div>

      <WatchAdModal 
        isOpen={isWatchAdOpen} 
        onClose={() => setIsWatchAdOpen(false)} 
      />
    </div>
  );
};
