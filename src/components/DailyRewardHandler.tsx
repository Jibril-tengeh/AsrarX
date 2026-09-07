import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatures } from '../contexts/FeatureContext';
import { doc, setDoc, increment } from 'firebase/firestore';
import { db, auth, isAutoSaveEnabled } from '../lib/firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, BellOff, Award } from 'lucide-react';

export const DailyRewardHandler: React.FC = () => {
  const { user } = useAuth();
  const { featureToggles } = useFeatures();
  const { t } = useLanguage();
  const [showReward, setShowReward] = useState(false);
  const [showDailyNotif, setShowDailyNotif] = useState(false);
  const [lastGrantedAmount, setLastGrantedAmount] = useState(10);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('asrar_mute_minute_points_toast') === 'true';
  });

  // Admin Configured Settings with Fallbacks
  const pointsSystemEnabled = featureToggles?.pointsSystemEnabled !== false; // Enabled by default unless explicitly set to false
  const notificationLimit = Number(featureToggles?.pointsDailyNotificationLimit ?? 1); // Max times notification displays per day (default 1)
  const requiredDurationSeconds = Math.max(10, Number(featureToggles?.pointsRequiredDurationSeconds ?? 60)); // Active duration in app required (default 60s)
  const dailyRewardAmount = Number(featureToggles?.pointsDailyRewardAmount ?? 10); // Points per daily check-in (default 10)
  const durationRewardAmount = Number(featureToggles?.pointsDurationRewardAmount ?? 1); // Points per active duration (default 1)
  const streakBonusAmount = Number(featureToggles?.pointsDailyStreakBonus ?? 5); // Streak bonus (default 5)

  const handleMuteToasts = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem('asrar_mute_minute_points_toast', 'true');
    setIsMuted(true);
    setShowReward(false);
  };

  useEffect(() => {
    if (!user || !pointsSystemEnabled) return;

    const uid = user.uid;
    const todayStr = new Date().toISOString().split('T')[0];

    // --- 1. Daily Check-in Points Reward (Once per day or up to notificationLimit) ---
    const checkAndAwardDailyReward = async () => {
      try {
        const notifKey = `asrar_daily_notif_count_${uid}_${todayStr}`;
        let currentNotifCount = parseInt(localStorage.getItem(notifKey) || '0', 10);

        const lastReward = user.lastDailyRewardDate;
        let lastRewardTime = 0;
        if (lastReward) {
          if (typeof (lastReward as any)?.toDate === 'function') {
            lastRewardTime = (lastReward as any).toDate().getTime();
          } else if (typeof lastReward === 'number') {
            lastRewardTime = lastReward;
          } else {
            lastRewardTime = new Date(lastReward).getTime();
          }
        }

        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const isNewDay = lastRewardTime === 0 || (now - lastRewardTime) >= twentyFourHours;

        if (isNewDay && currentNotifCount < notificationLimit) {
          // Check streak bonus (if last reward was within 48h, user maintained a streak)
          const isStreak = lastRewardTime > 0 && (now - lastRewardTime) <= (48 * 60 * 60 * 1000);
          const totalGranted = dailyRewardAmount + (isStreak ? streakBonusAmount : 0);

          if (isAutoSaveEnabled() && auth.currentUser && !uid.startsWith('local_')) {
            const userRef = doc(db, 'users', uid);
            try {
              await setDoc(userRef, {
                spiritualPoints: increment(totalGranted),
                lastDailyRewardDate: now
              }, { merge: true });
            } catch (fsErr) {
              console.warn("Daily points sync to Firestore skipped:", fsErr);
            }
          }

          localStorage.setItem(notifKey, (currentNotifCount + 1).toString());
          setLastGrantedAmount(totalGranted);
          setShowDailyNotif(true);

          setTimeout(() => {
            setShowDailyNotif(false);
          }, 5000);
        }
      } catch (error) {
        console.warn("Error checking/awarding daily points:", error);
      }
    };

    checkAndAwardDailyReward();

    // --- 2. Active duration reward ---
    const durationCountKey = `asrar_duration_notif_count_${uid}_${todayStr}`;
    const secondsKey = `asrar_reward_seconds_${uid}`;

    let secondsSpent = parseInt(localStorage.getItem(secondsKey) || '0', 10);

    const intervalId = setInterval(async () => {
      let durationNotifCount = parseInt(localStorage.getItem(durationCountKey) || '0', 10);

      // If user reached max daily notification display limit for duration points, stop counting
      if (durationNotifCount >= notificationLimit) return;

      secondsSpent += 1;
      localStorage.setItem(secondsKey, secondsSpent.toString());

      if (secondsSpent >= requiredDurationSeconds) {
        secondsSpent = 0;
        localStorage.setItem(secondsKey, '0');

        durationNotifCount += 1;
        localStorage.setItem(durationCountKey, durationNotifCount.toString());

        try {
          if (isAutoSaveEnabled() && auth.currentUser && !uid.startsWith('local_')) {
            const userRef = doc(db, 'users', uid);
            await setDoc(userRef, {
              spiritualPoints: increment(durationRewardAmount)
            }, { merge: true }).catch((fsErr) => {
              console.warn("Duration points sync to Firestore skipped:", fsErr);
            });
          }

          setPointsEarned(durationRewardAmount);

          // Only show non-intrusive toast if not muted by user
          const muted = localStorage.getItem('asrar_mute_minute_points_toast') === 'true';
          if (!muted) {
            setShowReward(true);
            setTimeout(() => {
              setShowReward(false);
            }, 3000);
          }
        } catch (error) {
          console.warn("Error updating duration-based spiritual points:", error);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [
    user?.uid,
    user?.lastDailyRewardDate,
    pointsSystemEnabled,
    notificationLimit,
    requiredDurationSeconds,
    dailyRewardAmount,
    durationRewardAmount,
    streakBonusAmount
  ]);

  // If points system is disabled by admin, render nothing
  if (!pointsSystemEnabled) return null;

  return (
    <AnimatePresence>
      {/* Active duration-based reward toast */}
      {showReward && !isMuted && (
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="fixed top-16 right-4 z-[9999] bg-slate-900/95 text-white border border-emerald-500/30 shadow-xl backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2.5 max-w-xs"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles size={13} className="text-amber-400 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-xs font-semibold text-slate-100 truncate">
              +{pointsEarned} {pointsEarned > 1 ? 'Points Spirituels' : 'Point Spirituel'}
              <span className="text-[11px] text-emerald-400 font-bold ml-1.5">(Temps actif)</span>
            </p>
          </div>
          <button
            onClick={handleMuteToasts}
            title="Masquer les alertes de temps passé"
            className="p-1 text-slate-400 hover:text-amber-400 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <BellOff size={12} />
          </button>
          <button 
            onClick={() => setShowReward(false)}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X size={13} />
          </button>
        </motion.div>
      )}

      {/* Daily check-in notification toast */}
      {showDailyNotif && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-16 right-4 z-[9999] max-w-sm w-[calc(100vw-2rem)] bg-slate-900/95 text-white border border-amber-500/40 shadow-2xl backdrop-blur-md rounded-2xl p-4 flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20">
            <Award size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
              <span>+{lastGrantedAmount} Points Spirituels</span>
              <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-500/30">
                Gain Quotidien
              </span>
            </h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              {t('dailyReward.dailySuccessDesc', `Vos ${lastGrantedAmount} points spirituels quotidiens ont été crédités à votre solde.`)}
            </p>
          </div>
          <button 
            onClick={() => setShowDailyNotif(false)}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

