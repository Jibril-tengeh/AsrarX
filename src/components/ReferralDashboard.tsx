import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Share2, Users, Gift, Copy, Check, Sparkles, Clock, Send, 
  MessageCircle, Award, Star, TrendingUp, ShieldCheck, 
  QrCode, HelpCircle, ChevronRight, ChevronDown, Flame,
  Zap, Info, Search, Filter, RefreshCw, Layers, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  generateUserReferralCode, 
  getReferralConfig, 
  ReferralConfig, 
  DEFAULT_REFERRAL_CONFIG,
  getUserReferrals,
  ReferralRecord,
  getReferralTier,
  REFERRAL_TIERS
} from '../services/referralService';

export const ReferralDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [config, setConfig] = useState<ReferralConfig>(DEFAULT_REFERRAL_CONFIG);
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'tiers' | 'faq'>('overview');
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [simulatedCount, setSimulatedCount] = useState(5);
  const [showQrModal, setShowQrModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const isFr = language === 'fr';
  const isHa = language === 'ha';

  const referralCode = user ? ((user as any).referralCode || generateUserReferralCode(user)) : 'ASRAR-VIP';
  const referralCount = (user as any)?.referralCount || referrals.length || 0;
  const rewardHours = config.rewardHours ?? 1;
  const refereeHours = config.refereeRewardHours ?? 1;
  const spiritualPointsPerRef = config.spiritualPointsPerReferral ?? 50;
  const totalEarnedHours = referralCount * rewardHours;
  const totalSpiritualPoints = referralCount * spiritualPointsPerRef;

  const { currentTier, nextTier, progressPercent } = getReferralTier(referralCount);

  // Sharing link construction
  const baseUrl = config.customShareBaseUrl?.trim() || (typeof window !== 'undefined' ? window.location.origin : 'https://asrarhub.com');
  const referralLink = baseUrl.includes('?') 
    ? `${baseUrl}&ref=${referralCode}` 
    : `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}?ref=${referralCode}`;

  useEffect(() => {
    getReferralConfig().then(setConfig);
  }, []);

  useEffect(() => {
    if (user?.uid) {
      setIsLoadingReferrals(true);
      getUserReferrals(user.uid)
        .then(data => {
          setReferrals(data);
        })
        .finally(() => {
          setIsLoadingReferrals(false);
        });
    }
  }, [user?.uid]);

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
    ? `🎁 Rejoins AsrarHub avec mon code VIP ${referralCode} et débloque +${refereeHours}h de Premium gratuit pour explorer tous les secrets ésotériques sacrés ! Clique ici : ${referralLink}`
    : isHa
    ? `🎁 Shiga AsrarHub da lambar gayyatata ${referralCode} domin samun sa'o'i +${refereeHours} na Premium kyauta don dukkan asirai! Latsa nan: ${referralLink}`
    : `🎁 Join AsrarHub with my VIP referral code ${referralCode} and unlock +${refereeHours}h of free Premium to explore all sacred esoteric secrets! Click here: ${referralLink}`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'AsrarHub - Invitation VIP',
        text: shareText,
        url: referralLink,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const filteredReferrals = referrals.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.referredName && r.referredName.toLowerCase().includes(q)) ||
      (r.referredEmail && r.referredEmail.toLowerCase().includes(q)) ||
      (r.referralCode && r.referralCode.toLowerCase().includes(q))
    );
  });

  const getTierName = (tier: any) => {
    if (isHa) return tier.nameHa;
    if (isFr) return tier.nameFr;
    return tier.nameEn;
  };

  const getTierPerk = (tier: any) => {
    if (isHa) return tier.perkHa;
    if (isFr) return tier.perkFr;
    return tier.perkEn;
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(referralLink)}&bgcolor=ffffff&color=059669`;

  return (
    <div className="space-y-6" id="referral-dashboard-root">
      
      {/* 1. Hero Ambassador Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-gray-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-500/30">
        
        {/* Ambient atmospheric glows */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>{t('referralDashboard.pageTitle', 'Tableau de Bord de Parrainage')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>VIP</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {isFr ? (
                <>Partagez la Lumière, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">Gagnez du Temps</span></>
              ) : isHa ? (
                <>Raba Haske, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">Sami Sa'o'in Premium</span></>
              ) : (
                <>Share Wisdom, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">Earn Free Premium</span></>
              )}
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed">
              {t('referralDashboard.pageSubtitle', 'Invitez vos proches, gagnez des heures Premium gratuites et progressez dans les rangs Ambassadeur.')}
            </p>
          </div>

          {/* Current Rank Badge Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-inner flex flex-col items-center justify-center text-center min-w-[200px]">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${currentTier.iconBg} p-0.5 shadow-lg flex items-center justify-center mb-2`}>
              <div className="w-full h-full bg-gray-900/40 backdrop-blur-xs rounded-[14px] flex items-center justify-center text-amber-300">
                <Trophy size={26} />
              </div>
            </div>
            <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
              {t('referralDashboard.kpiCurrentRank', 'Rang Ambassadeur')}
            </span>
            <span className="text-base font-black text-amber-300 mt-0.5">
              {getTierName(currentTier)}
            </span>
            <span className="text-[10px] text-emerald-300 font-medium mt-1">
              +{rewardHours}h {isFr ? 'par ami' : 'per invite'}
            </span>
          </div>
        </div>

        {/* Next Tier Progress Bar */}
        {nextTier && (
          <div className="relative z-10 mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-300 mb-1.5">
              <span>{t('referralDashboard.nextTierProgress', 'Progression vers le rang {next} :', { next: getTierName(nextTier) })}</span>
              <span className="text-amber-300 font-bold">{referralCount} / {nextTier.minReferrals} ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

      </div>

      {/* 2. Key Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Card 1: Total Referrals */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-200/80 dark:border-gray-700/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('referralDashboard.kpiTotalReferrals', 'Filleuls Inscrits')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {referralCount}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp size={12} />
            <span>{referralCount > 0 ? (isFr ? 'Membres actifs' : 'Active members') : (isFr ? 'Partagez votre code' : 'Share your code')}</span>
          </div>
        </div>

        {/* Card 2: Total Hours Earned */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-200/80 dark:border-gray-700/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('referralDashboard.kpiTotalHours', 'Heures Premium')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            +{totalEarnedHours}h
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1">
            {isFr ? 'Cumulable sans limite' : 'Unlimited stacking'}
          </div>
        </div>

        {/* Card 3: Spiritual Points */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-200/80 dark:border-gray-700/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('referralDashboard.kpiSpiritualPoints', 'Points Spirituels')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Flame size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
            {totalSpiritualPoints}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1">
            +{spiritualPointsPerRef} pts {isFr ? 'par filleul' : 'per invite'}
          </div>
        </div>

        {/* Card 4: Referee Gift Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-gray-200/80 dark:border-gray-700/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {isFr ? 'Cadeau Filleul' : isHa ? 'Ladan Sabon Shiga' : 'Referee Gift'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Gift size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
            +{refereeHours}h
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1">
            {isFr ? 'Offert à chaque nouvel ami' : 'Free for every friend'}
          </div>
        </div>

      </div>

      {/* 3. Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl overflow-x-auto scrollbar-none border border-gray-200 dark:border-gray-700/60">
        
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 min-w-[130px] py-2.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Share2 size={16} />
          <span>{t('referralDashboard.tabOverview', 'Vue d\'ensemble & Partage')}</span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex-1 min-w-[130px] py-2.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'referrals'
              ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users size={16} />
          <span>{t('referralDashboard.tabReferrals', 'Mes Filleuls')} ({referrals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tiers')}
          className={`flex-1 min-w-[130px] py-2.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'tiers'
              ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Trophy size={16} />
          <span>{t('referralDashboard.tabTiers', 'Niveaux & Rangs VIP')}</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 min-w-[130px] py-2.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'faq'
              ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle size={16} />
          <span>{t('referralDashboard.tabHowItWorks', 'Comment ça marche ?')}</span>
        </button>

      </div>

      {/* 4. Tab Content Panels */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: OVERVIEW & SHARE STUDIO */}
        {activeTab === 'overview' && (
          <motion.div
            key="tab-overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            
            {/* Share Studio Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-7 border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-6">
              
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Share2 className="text-emerald-500" size={20} />
                  <span>{isFr ? "Studio de Partage & Liens Rapides" : isHa ? "Wurin Raba Lambobi & Hanyoyi" : "Share Studio & Fast Links"}</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {isFr 
                    ? "Copiez votre code ou envoyez directement votre lien pré-rempli sur vos réseaux favoris."
                    : isHa
                    ? "Kwafi lambarku ko aika hanyar kai tsaye a WhatsApp ko Telegram."
                    : "Copy your exclusive code or share directly via WhatsApp, Telegram or social networks."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Unique Code Box */}
                <div className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/80 space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-500" />
                    <span>{t('referralDashboard.uniqueCodeLabel', 'Votre Code Exclusif')}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 font-mono font-black text-base text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center justify-between">
                      <span>{referralCode}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">VIP</span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                    >
                      {copiedCode ? <Check size={16} className="text-emerald-200" /> : <Copy size={16} />}
                      <span>{copiedCode ? t('referralDashboard.codeCopied', 'Copié !') : t('referralDashboard.copyCode', 'Copier Code')}</span>
                    </button>
                  </div>
                </div>

                {/* Direct Link Box */}
                <div className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/80 space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Zap size={13} className="text-emerald-500" />
                    <span>{t('referralDashboard.directLinkLabel', 'Lien de Partage Direct (1-Clic)')}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs font-mono text-gray-600 dark:text-gray-300 truncate select-all">
                      {referralLink}
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className="px-3.5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                    >
                      {copiedLink ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                      <span>{copiedLink ? t('referralDashboard.linkCopied', 'Copié !') : t('referralDashboard.copyLink', 'Copier Lien')}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* 1-Click Social Sharing Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                  {isFr ? "Partager en 1-clic :" : isHa ? "Raba a danna 1 :" : "1-Click Direct Share:"}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  
                  <button
                    onClick={handleWhatsAppShare}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={handleTelegramShare}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <Send size={16} />
                    <span>Telegram</span>
                  </button>

                  <button
                    onClick={handleFacebookShare}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <Share2 size={16} />
                    <span>Facebook</span>
                  </button>

                  <button
                    onClick={handleTwitterShare}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <Share2 size={16} />
                    <span>X / Twitter</span>
                  </button>

                  <button
                    onClick={() => setShowQrModal(true)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer col-span-2 sm:col-span-1"
                  >
                    <QrCode size={16} />
                    <span>QR Code</span>
                  </button>

                </div>
              </div>

            </div>

            {/* Interactive Rewards Simulator */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-amber-50/40 dark:from-emerald-950/30 dark:via-gray-800 dark:to-amber-950/20 rounded-3xl p-5 sm:p-7 border border-emerald-500/20 dark:border-emerald-500/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={18} />
                    <span>{t('referralDashboard.simulatorTitle', 'Simulateur de Récompenses')}</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('referralDashboard.simulatorSubtitle', 'Estimez vos gains Premium en invitant votre communauté')}
                  </p>
                </div>
                <div className="px-3 py-1 bg-amber-500 text-white rounded-full font-bold text-xs self-start sm:self-auto shadow-xs">
                  {simulatedCount} {isFr ? 'Amis' : 'Friends'}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span>{t('referralDashboard.simulatorSliderLabel', 'Nombre d\'amis invités :')}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm font-black">{simulatedCount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={simulatedCount}
                  onChange={(e) => setSimulatedCount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>1 ami</span>
                  <span>10 amis</span>
                  <span>20 amis</span>
                  <span>30 amis</span>
                </div>
              </div>

              {/* Simulation Result Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xs rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    +{simulatedCount * rewardHours}h
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                      {isFr ? "Gain Premium Total" : "Total Premium Gain"}
                    </div>
                    <div className="text-sm font-extrabold text-gray-900 dark:text-white">
                      +{simulatedCount * rewardHours} {t('referralDashboard.hoursPremium', 'heures de Premium')}
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xs rounded-2xl p-4 border border-purple-200 dark:border-purple-800/40 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    +{simulatedCount * spiritualPointsPerRef}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                      {isFr ? "Points Spirituels" : "Spiritual Points"}
                    </div>
                    <div className="text-sm font-extrabold text-gray-900 dark:text-white">
                      +{simulatedCount * spiritualPointsPerRef} {t('referralDashboard.spiritualPointsUnit', 'points spirituels')}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 2: MY REFERRALS */}
        {activeTab === 'referrals' && (
          <motion.div
            key="tab-referrals"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-7 border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="text-emerald-500" size={20} />
                    <span>{t('referralDashboard.myReferralsTitle', 'Historique de vos Filleuls')}</span>
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('referralDashboard.myReferralsDesc', 'Liste en temps réel des utilisateurs inscrits avec votre code de parrainage.')}
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[220px]">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('referralDashboard.searchReferralsPlaceholder', 'Rechercher un filleul...')}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Referrals List Table / Cards */}
              {isLoadingReferrals ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-400 space-y-2">
                  <RefreshCw className="animate-spin text-emerald-500" size={24} />
                  <span className="text-xs">{isFr ? "Chargement des filleuls..." : "Loading referrals..."}</span>
                </div>
              ) : filteredReferrals.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-700/80 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Gift size={26} />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {t('referralDashboard.noReferralsYet', 'Vous n\'avez pas encore de filleul enregistré.')}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('referralDashboard.noReferralsSub', 'Partagez votre lien ou votre code sur WhatsApp et Telegram pour débloquer vos premières heures de Premium !')}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Share2 size={14} />
                    <span>{isFr ? "Partager mon code" : "Share my code"}</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3 px-3">{t('referralDashboard.colReferee', 'Filleul')}</th>
                        <th className="pb-3 px-3">{t('referralDashboard.colDate', 'Date')}</th>
                        <th className="pb-3 px-3">{t('referralDashboard.colReward', 'Gain Parrain')}</th>
                        <th className="pb-3 px-3">{t('referralDashboard.colRefereeReward', 'Gain Filleul')}</th>
                        <th className="pb-3 px-3">{t('referralDashboard.colStatus', 'Statut')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {filteredReferrals.map((ref, idx) => {
                        const dateFormatted = ref.createdAt?.toDate 
                          ? ref.createdAt.toDate().toLocaleDateString(isFr ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                          : (ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : 'Récemment');

                        // Mask email for privacy (e.g. j***@gmail.com)
                        const emailMasked = ref.referredEmail 
                          ? ref.referredEmail.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => `${a}***${c}`)
                          : '';

                        return (
                          <tr key={ref.id ? `ref-${ref.id}-${idx}` : `ref-row-${idx}`} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
                            <td className="py-3.5 px-3">
                              <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                                  {(ref.referredName || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div>{ref.referredName || 'Membre AsrarHub'}</div>
                                  {emailMasked && <div className="text-[10px] text-gray-400 font-mono">{emailMasked}</div>}
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-gray-600 dark:text-gray-300 font-medium">
                              {dateFormatted}
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="inline-flex items-center gap-1 font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md text-[11px]">
                                <Clock size={12} />
                                <span>+{ref.rewardHours || 1}h</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="inline-flex items-center gap-1 font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-md text-[11px]">
                                <Gift size={12} />
                                <span>+{ref.refereeRewardHours || 1}h</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                                <ShieldCheck size={12} />
                                <span>{t('referralDashboard.statusActive', 'Actif & Validé')}</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </motion.div>
        )}

        {/* TAB 3: TIERS & RANKS */}
        {activeTab === 'tiers' && (
          <motion.div
            key="tab-tiers"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-7 border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-6">
              
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Trophy className="text-amber-500" size={20} />
                  <span>{t('referralDashboard.tiersTitle', 'Progression & Niveaux Ambassadeur')}</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('referralDashboard.tiersSubtitle', 'Chaque nouveau parrainage vous rapproche du rang supérieur et de privilèges spirituels uniques.')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {REFERRAL_TIERS.map((tier, tierIdx) => {
                  const isUnlocked = referralCount >= tier.minReferrals;
                  const isCurrent = currentTier.id === tier.id;

                  return (
                    <div
                      key={`tier-${tier.id || tierIdx}-${tier.minReferrals}`}
                      className={`relative rounded-2xl p-5 border transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-br from-emerald-50 to-amber-50/50 dark:from-emerald-950/40 dark:to-gray-850 border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                          : isUnlocked
                          ? 'bg-white dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 shadow-xs'
                          : 'bg-gray-50/70 dark:bg-gray-900/40 border-gray-200/60 dark:border-gray-800 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tier.iconBg} text-white flex items-center justify-center shadow-sm`}>
                            <Trophy size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                              <span>{getTierName(tier)}</span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white">
                                  {isFr ? "Rang Actuel" : "Current"}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                              {tier.minReferrals === 0 
                                ? (isFr ? 'Dès l\'inscription' : 'At sign-up') 
                                : `${tier.minReferrals}+ ${isFr ? 'filleuls requis' : 'referrals required'}`}
                            </div>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          isUnlocked
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-300'
                        }`}>
                          {isUnlocked ? t('referralDashboard.unlocked', 'Débloqué') : t('referralDashboard.locked', 'À débloquer')}
                        </span>
                      </div>

                      <div className="text-xs text-gray-700 dark:text-gray-300 font-medium bg-white/60 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-2">
                        <Sparkles size={15} className="text-amber-500 shrink-0" />
                        <span>{getTierPerk(tier)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 4: HOW IT WORKS & FAQ */}
        {activeTab === 'faq' && (
          <motion.div
            key="tab-faq"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            
            {/* 3 Step Visual Guide */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-7 border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-6">
              
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Info className="text-emerald-500" size={20} />
                  <span>{t('referralDashboard.howItWorksTitle', 'Guide Simplifié du Parrainage')}</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Step 1 */}
                <div className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl p-5 border border-gray-200 dark:border-gray-700/80 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-sm mb-2">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {t('referralDashboard.step1Title', '1. Partagez votre code')}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('referralDashboard.step1Desc', 'Envoyez votre lien ou votre code personnalisé à vos amis, groupes d\'études ou proches.')}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl p-5 border border-gray-200 dark:border-gray-700/80 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-sm mb-2">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {t('referralDashboard.step2Title', '2. Votre ami s\'inscrit')}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('referralDashboard.step2Desc', 'À la création de son compte, il reçoit instantanément +1 heure de Premium gratuit pour découvrir les secrets.')}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl p-5 border border-gray-200 dark:border-gray-700/80 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center shadow-sm mb-2">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {t('referralDashboard.step3Title', '3. Vous recevez votre bonus')}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('referralDashboard.step3Desc', 'Vous recevez automatiquement +1 heure de Premium cumulable ainsi que des points spirituels.')}
                  </p>
                </div>

              </div>

            </div>

            {/* FAQ Accordion */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-7 border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-4">
              
              <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="text-amber-500" size={18} />
                <span>{t('referralDashboard.faqTitle', 'Questions Fréquentes (FAQ)')}</span>
              </h3>

              <div className="space-y-2.5">
                
                {/* FAQ 1 */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === 0 ? null : 0)}
                    className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-800/60 flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-gray-900 dark:text-white transition-colors cursor-pointer"
                  >
                    <span>{t('referralDashboard.faq1Q', 'Y a-t-il une limite au nombre d\'heures Premium cumulables ?')}</span>
                    <ChevronDown size={16} className={`transition-transform ${expandedFaq === 0 ? 'rotate-180 text-emerald-500' : 'text-gray-400'}`} />
                  </button>
                  {expandedFaq === 0 && (
                    <div className="p-4 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700/60">
                      {t('referralDashboard.faq1A', 'Non, aucune limite ! Si vous parrainez 10 personnes, vous gagnez 10 heures complètes de temps Premium qui s\'ajoutent à votre compte.')}
                    </div>
                  )}
                </div>

                {/* FAQ 2 */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}
                    className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-800/60 flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-gray-900 dark:text-white transition-colors cursor-pointer"
                  >
                    <span>{t('referralDashboard.faq2Q', 'Quand les heures sont-elles créditées ?')}</span>
                    <ChevronDown size={16} className={`transition-transform ${expandedFaq === 1 ? 'rotate-180 text-emerald-500' : 'text-gray-400'}`} />
                  </button>
                  {expandedFaq === 1 && (
                    <div className="p-4 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700/60">
                      {t('referralDashboard.faq2A', 'Les heures sont créditées immédiatement à la seconde où votre filleul valide son inscription.')}
                    </div>
                  )}
                </div>

                {/* FAQ 3 */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === 2 ? null : 2)}
                    className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-800/60 flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-gray-900 dark:text-white transition-colors cursor-pointer"
                  >
                    <span>{t('referralDashboard.faq3Q', 'Que se passe-t-il si j\'ai déjà un abonnement actif ?')}</span>
                    <ChevronDown size={16} className={`transition-transform ${expandedFaq === 2 ? 'rotate-180 text-emerald-500' : 'text-gray-400'}`} />
                  </button>
                  {expandedFaq === 2 && (
                    <div className="p-4 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700/60">
                      {t('referralDashboard.faq3A', 'Vos heures de parrainage prolongent automatiquement la date d\'expiration de votre accès existant.')}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4 text-center">
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                <QrCode size={18} className="text-emerald-600" />
                <span>{t('referralDashboard.qrCodeTitle', 'Scanner le QR Code')}</span>
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500/30 inline-block shadow-inner">
              <img 
                src={qrImageUrl} 
                alt="QR Code Parrainage" 
                className="w-48 h-48 mx-auto object-contain rounded-lg"
              />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('referralDashboard.qrCodeDesc', 'Faites scanner ce code pour une inscription instantanée avec vos avantages.')}
            </p>

            <div className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 py-2 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
              {referralCode}
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
            >
              {isFr ? "Fermer" : "Close"}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default ReferralDashboard;
