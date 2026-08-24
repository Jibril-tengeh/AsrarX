import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Share2, Users, Gift, Copy, Check, Sparkles, Clock, Send, MessageCircle, ExternalLink, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { generateUserReferralCode, getReferralConfig, ReferralConfig, DEFAULT_REFERRAL_CONFIG } from '../services/referralService';

export const ReferralCenter: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [config, setConfig] = useState<ReferralConfig>(DEFAULT_REFERRAL_CONFIG);

  useEffect(() => {
    getReferralConfig().then(setConfig);
  }, []);

  const referralCode = user ? (user as any).referralCode || generateUserReferralCode(user) : 'ASRAR-VIP';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://asrarhub.com';
  const referralLink = `${origin}?ref=${referralCode}`;

  const isFr = language === 'fr';
  const isHa = language === 'ha';

  const rewardHours = config.rewardHours || 6;
  const refereeHours = config.refereeRewardHours || 4;
  const referralCount = (user as any)?.referralCount || 0;
  const totalEarnedHours = referralCount * rewardHours;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareText = isFr
    ? `🎁 Rejoins AsrarHub avec mon code parrain ${referralCode} et débloque +${refereeHours}h de Premium gratuit pour explorer tous les secrets ésotériques sacrés ! Cliquez ici : ${referralLink}`
    : isHa
    ? `🎁 Shiga AsrarHub da lambar gayyatata ${referralCode} domin samun sa'o'i +${refereeHours} na Premium kyauta don dukkan asirai! Latsa nan: ${referralLink}`
    : `🎁 Join AsrarHub with my referral code ${referralCode} and unlock +${refereeHours}h of free Premium to explore all sacred esoteric secrets! Click here: ${referralLink}`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AsrarHub - Invitation VIP',
        text: shareText,
        url: referralLink,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900/10 via-amber-500/10 to-teal-900/10 dark:from-emerald-950/40 dark:via-gray-900 dark:to-teal-950/40 rounded-3xl p-5 sm:p-7 shadow-sm border border-amber-400/30 dark:border-amber-500/20 mb-6">
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-200/60 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[14px] flex items-center justify-center">
              <Gift size={24} className="text-amber-500 animate-bounce" />
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>{isFr ? "Espace Parrainage & Récompenses VIP" : isHa ? "Wurin Gayyata & Kyaututtukan VIP" : "Referral & VIP Rewards Center"}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
                +{rewardHours}h / Ami
              </span>
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {isFr
                ? `Offrez du Premium à vos proches et recevez ${rewardHours} heures de Premium gratuites à chaque inscription.`
                : isHa
                ? `Ku ba da damar Premium ga 'yan uwa kuma ku sami sa'o'i ${rewardHours} na Premium kyauta a kowace rajista.`
                : `Gift Premium to your friends and receive ${rewardHours} hours of free Premium for each registration.`}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: Codes and Actions */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Referral Code Box */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-xs">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" />
              <span>{isFr ? "Votre Code de Parrainage Unique" : isHa ? "Lambar Gayyatarku Ta Musamman" : "Your Unique Referral Code"}</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 flex items-center justify-between font-mono font-black text-base sm:text-lg text-emerald-600 dark:text-emerald-400 tracking-wider">
                <span>{referralCode}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Code Actif</span>
              </div>
              <button 
                onClick={handleCopyCode}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                title={isFr ? "Copier le code" : "Copy Code"}
              >
                {copiedCode ? <Check size={16} className="text-emerald-200" /> : <Copy size={16} />}
                <span>{copiedCode ? (isFr ? "Copié !" : "Copied!") : (isFr ? "Copier Code" : "Copy Code")}</span>
              </button>
            </div>
          </div>

          {/* Referral Link Box */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-xs">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5 flex items-center gap-1.5">
              <Share2 size={13} className="text-emerald-500" />
              <span>{isFr ? "Lien d'invitation directe (1-Clic)" : isHa ? "Hanyar Gayyata Kai Tsaye" : "Direct 1-Click Invite Link"}</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-gray-600 dark:text-gray-300 truncate select-all">
                {referralLink}
              </div>
              <button 
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                title={isFr ? "Copier le lien" : "Copy Link"}
              >
                {copiedLink ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                <span>{copiedLink ? (isFr ? "Copié !" : "Copied!") : (isFr ? "Copier Lien" : "Copy Link")}</span>
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button 
              onClick={handleWhatsAppShare}
              className="flex-1 min-w-[130px] bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </button>
            <button 
              onClick={handleTelegramShare}
              className="flex-1 min-w-[130px] bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <Send size={16} />
              <span>Telegram</span>
            </button>
            <button 
              onClick={handleNativeShare}
              className="flex-1 min-w-[130px] bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <Share2 size={16} />
              <span>{isFr ? "Plus d'options" : "Share"}</span>
            </button>
          </div>

        </div>

        {/* Right Side: Stats Badges */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            
            {/* Stat 1: Total Invited */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl p-4 border border-gray-200/80 dark:border-gray-700 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Users size={22} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  {referralCount}
                </div>
                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {isFr ? "Filleuls Inscrits" : isHa ? "Abokan da Suka Yi Rajista" : "Registered Referrals"}
                </div>
              </div>
            </div>

            {/* Stat 2: Total Hours Earned */}
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/20 dark:from-amber-950/30 dark:to-amber-900/20 rounded-2xl p-4 border border-amber-400/40 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Clock size={22} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 flex items-baseline gap-1">
                  <span>+{totalEarnedHours}h</span>
                </div>
                <div className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {isFr ? "Heures Premium Gagnées" : isHa ? "Awannin Premium da Aka Samu" : "Premium Hours Earned"}
                </div>
              </div>
            </div>

          </div>

          {/* Quick Explanatory Footer */}
          <div className="bg-emerald-500/10 dark:bg-emerald-950/30 rounded-xl p-3 border border-emerald-500/20 text-[11px] text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Award size={16} className="text-emerald-500 shrink-0" />
            <span>
              {isFr
                ? `Chaque filleul gagne +${refereeHours}h et vous recevez +${rewardHours}h cumulables sans limite !`
                : `Each referral gets +${refereeHours}h and you receive +${rewardHours}h unlimited!`}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
