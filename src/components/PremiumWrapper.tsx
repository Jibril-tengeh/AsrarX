import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatures } from '../contexts/FeatureContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Lock, Sparkles, Eye, Play, Coins, Check, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WatchAdModal } from './WatchAdModal';
import { spendPoints } from '../lib/points';

interface PremiumWrapperProps {
  children: React.ReactNode;
  itemId?: string; // The ID of the article/content being unlocked
  pointsCost?: number; // Specific points cost if configured
  requiredTier?: 'premium' | 'pro';
  fallbackMessage?: string;
  fallbackTitle?: string;
  previewContent?: React.ReactNode;
  enabled?: boolean;
}

export const PremiumWrapper: React.FC<PremiumWrapperProps> = ({ 
  children, 
  itemId,
  pointsCost,
  requiredTier = 'premium',
  fallbackTitle,
  fallbackMessage,
  previewContent,
  enabled = true
}) => {
  const { user } = useAuth();
  const { featureToggles } = useFeatures();
  const { t } = useLanguage();
  const [showPreview, setShowPreview] = useState(false);
  const [isWatchAdOpen, setIsWatchAdOpen] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  const activeFallbackTitle = fallbackTitle || t('premium.fallbackTitle', 'Lecture Secrète Premium');
  const activeFallbackMessage = fallbackMessage || t('premium.fallbackMessage', 'Ce contenu est réservé aux membres Premium. Débloquez-le pour y accéder.');

  const premiumCardEnabled = featureToggles['premiumCardEnabled'] !== false;

  if (!enabled || !premiumCardEnabled) {
    return <>{children}</>;
  }

  const isPremium = user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro';
  const isPro = user?.subscriptionTier === 'pro';

  // Check if they have access via paid subscription
  const hasPaidAccess = requiredTier === 'pro' ? isPro : isPremium;

  // Check if they have access via points purchase (for this specific item)
  const hasPurchasedAccess = itemId && user?.purchasedItems?.includes(itemId);

  const hasAccess = hasPaidAccess || hasPurchasedAccess;

  // Configuration values from admin panel
  const adsEnabledForFree = featureToggles['adsEnabledForFree'] !== false;
  const globalPointsToUnlock = featureToggles['pointsToUnlockArticle'] === undefined ? 20 : Number(featureToggles['pointsToUnlockArticle']);
  const pointsToUnlock = pointsCost !== undefined ? pointsCost : globalPointsToUnlock;
  const pointsPerAd = featureToggles['pointsPerAd'] === undefined ? 10 : Number(featureToggles['pointsPerAd']);

  // If user has access, render content immediately
  if (hasAccess) {
    return <>{children}</>;
  }

  const userPoints = user?.spiritualPoints || 0;
  const canUnlockWithPoints = userPoints >= pointsToUnlock;

  const handleUnlockWithPoints = async () => {
    if (!user || !itemId || isUnlocking || !canUnlockWithPoints) return;
    setIsUnlocking(true);
    try {
      await spendPoints(user.uid, pointsToUnlock, itemId, `Déblocage article premium : ${activeFallbackTitle}`);
      setUnlockSuccess(true);
    } catch (e) {
      console.error("Error unlocking content:", e);
    } finally {
      setIsUnlocking(false);
    }
  };

  // If ads are not enabled for free users, use the standard subscription-only wall
  if (!adsEnabledForFree) {
    if (showPreview && previewContent) {
      return (
        <div className="relative">
          <div className="pointer-events-none select-none blur-md opacity-60">
            {previewContent}
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg mb-6 shadow-violet-500/30">
                <Lock size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{activeFallbackTitle}</h2>
              <p className="text-gray-900 dark:text-gray-100 mb-6 font-medium max-w-sm drop-shadow-md">
                {t('premium.subscribeToView', "Abonnez-vous pour voir l'intégralité du contenu.")}
              </p>
              <Link 
                to="/payment" 
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold hover:from-amber-500 hover:to-orange-600 transition-colors shadow-xl flex items-center gap-2"
              >
                <Sparkles size={18} /> {t('premium.unlock', 'Débloquer')} {requiredTier === 'pro' ? 'Pro' : 'Premium'}
              </Link>
              <button 
                onClick={() => setShowPreview(false)}
                className="mt-4 text-sm font-bold text-gray-600 dark:text-gray-300 hover:underline"
              >
                {t('premium.cancel', 'Annuler')}
              </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg mb-6 shadow-violet-500/30">
          <Lock size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">{activeFallbackTitle}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
          {activeFallbackMessage}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link 
            to="/tools" 
            className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
          >
            {t('premium.back', 'Retour')}
          </Link>
          {previewContent && (
            <button 
              onClick={() => setShowPreview(true)}
              className="px-6 py-3 rounded-xl border-2 border-violet-200 dark:border-violet-900 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors flex items-center gap-2"
            >
              <Eye size={18} /> {t('premium.preview', 'Aperçu')}
            </button>
          )}
          <Link 
            to="/payment" 
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold hover:from-amber-500 hover:to-orange-600 transition-colors shadow-md flex items-center gap-2"
          >
            <Sparkles size={18} /> {t('premium.unlock', 'Débloquer')} {requiredTier === 'pro' ? 'Pro' : 'Premium'}
          </Link>
        </div>
      </div>
    );
  }

  // If ads & points are enabled, show the hybrid unlocking model
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none min-h-[85vh] flex flex-col justify-center">
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 sm:p-10 shadow-xl max-w-2xl mx-auto text-center overflow-hidden">
        
        {/* Floating badge */}
        <div className="absolute top-0 right-0 bg-violet-600 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1">
          <Sparkles size={12} className="animate-pulse" /> {t('premium.badge', 'Premium')}
        </div>

        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-6">
          <Lock size={32} className="text-white" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
          {activeFallbackTitle}
        </h2>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
          {activeFallbackMessage}
        </p>

        {/* Dynamic Point Box & Options */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-750 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {t('premium.yourBalance', 'Votre Solde')}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full font-bold text-sm">
              <Coins size={16} />
              <span>{userPoints} pts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option 1: Unlock with points */}
            <div className="flex flex-col justify-between p-4 bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-700 rounded-xl text-left shadow-sm">
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Coins size={16} className="text-amber-500" /> {t('premium.unlockWithPoints', 'Débloquer par Points')}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {t('premium.useBalanceDesc', 'Utilisez votre solde spirituel pour ouvrir cet article de façon définitive.')}
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleUnlockWithPoints}
                  disabled={!canUnlockWithPoints || isUnlocking}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    canUnlockWithPoints 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-95' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isUnlocking 
                    ? t('premium.unlocking', 'Déblocage...') 
                    : t('premium.buyForPoints', 'Acheter pour {points} pts').replace('{points}', pointsToUnlock.toString())
                  }
                </button>
                {!canUnlockWithPoints && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1.5 text-center">
                    {t('premium.insufficientPoints', 'Points insuffisants (manque {points} pts)').replace('{points}', (pointsToUnlock - userPoints).toString())}
                  </p>
                )}
              </div>
            </div>

            {/* Option 2: Watch Ad to earn points */}
            <div className="flex flex-col justify-between p-4 bg-white dark:bg-gray-850 border border-gray-150 dark:border-gray-700 rounded-xl text-left shadow-sm">
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Play size={16} fill="currentColor" className="text-emerald-500" /> {t('premium.earnPoints', 'Gagnez des Points')}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {t('premium.watchAdDesc', 'Visionnez une courte publicité sponsorisée pour accumuler des points.')}
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setIsWatchAdOpen(true)}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Play size={14} fill="currentColor" /> {t('premium.watchAdBtn', 'Voir la pub (+{points} pts)').replace('{points}', pointsPerAd.toString())}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Upgrade Alternative */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-violet-100 dark:border-violet-900/50 bg-violet-50/50 dark:bg-violet-950/20 rounded-2xl gap-4">
          <div className="text-left">
            <h4 className="font-bold text-sm text-violet-900 dark:text-violet-300 flex items-center gap-1">
              <Star size={16} fill="currentColor" className="text-amber-400" /> {t('premium.unlimitedVersion', 'Version Premium Illimitée')}
            </h4>
            <p className="text-xs text-violet-700 dark:text-violet-400 mt-0.5">
              {t('premium.unlimitedVersionDesc', 'Désactivez toutes les publicités et ouvrez tous les articles instantanément.')}
            </p>
          </div>
          <Link 
            to="/payment" 
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1"
          >
            {t('premium.subscribe', "S'abonner")} <ArrowRight size={14} />
          </Link>
        </div>

      </div>

      <WatchAdModal 
        isOpen={isWatchAdOpen} 
        onClose={() => setIsWatchAdOpen(false)} 
      />
    </div>
  );
};
