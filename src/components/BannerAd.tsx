import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BannerAd: React.FC = () => {
  const { user, isPremium: isAuthPremium } = useAuth();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  const isPremiumOrPro = user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro' || user?.role === 'admin' || isAuthPremium;

  if (!isVisible || user?.hideAds || isPremiumOrPro) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-3 sm:p-4 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden group">
      <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="flex-1 z-10 text-center sm:text-left">
        <div className="text-[10px] uppercase tracking-wider font-bold text-white/50 mb-1">{t('ad.sponsored', 'Sponsorisé')}</div>
        <h4 className="font-bold text-lg mb-1">{t('ad.unlockTitle', 'Débloquez votre plein potentiel spirituel')}</h4>
        <p className="text-blue-100 text-sm">{t('ad.unlockDesc', 'Passez à la version Premium pour accéder aux cours Sirr Al Asrar complets et supprimer ces publicités.')}</p>
      </div>

      <div className="flex items-center gap-3 z-10 w-full sm:w-auto">
        <Link 
          to="/payment" 
          className="flex-1 sm:flex-none text-center bg-white text-indigo-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          {t('ad.viewOffers', 'Voir les Offres')} <ExternalLink size={16} />
        </Link>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
          aria-label="Fermer l'annonce"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
