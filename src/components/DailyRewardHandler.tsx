import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db, isAutoSaveEnabled } from '../lib/firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, BellOff } from 'lucide-react';

export const DailyRewardHandler: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showReward, setShowReward] = useState(false);
  const [showDaily10, setShowDaily10] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('asrar_mute_minute_points_toast') === 'true';
  });

  const handleMuteMinuteToasts = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem('asrar_mute_minute_points_toast', 'true');
    setIsMuted(true);
    setShowReward(false);
  };

  useEffect(() => {
    if (!user) return;

    const uid = user.uid;

    // --- 1. Daily 10 Spiritual Points automatic credit ---
    const checkAndAwardDaily10 = async () => {
      try {
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

        // If never claimed, or more than 24h ago
        if (lastRewardTime === 0 || (now - lastRewardTime) >= twentyFourHours) {
          const userRef = doc(db, 'users', uid);
          if (isAutoSaveEnabled()) {
            await updateDoc(userRef, {
              spiritualPoints: increment(10),
              lastDailyRewardDate: now
            });
          }
          setShowDaily10(true);
          setTimeout(() => {
            setShowDaily10(false);
          }, 4000);
        }
      } catch (error) {
        console.error("Error checking/awarding daily 10 points:", error);
      }
    };

    checkAndAwardDaily10();

    // --- 2. Active duration reward ---
    const earnedKey = `asrar_reward_earned_today_${uid}`;
    const resetKey = `asrar_reward_reset_time_${uid}`;
    const secondsKey = `asrar_reward_seconds_${uid}`;

    // Load or initialize values
    let pointsToday = parseInt(localStorage.getItem(earnedKey) || '0', 10);
    let resetTime = parseInt(localStorage.getItem(resetKey) || '0', 10);
    let secondsSpent = parseInt(localStorage.getItem(secondsKey) || '0', 10);

    const now = Date.now();
    // If reset time is 0 or more than 24 hours ago, start a new 24h cycle
    if (resetTime === 0 || now - resetTime >= 24 * 60 * 60 * 1000) {
      pointsToday = 0;
      resetTime = now;
      secondsSpent = 0;
      localStorage.setItem(earnedKey, '0');
      localStorage.setItem(resetKey, now.toString());
      localStorage.setItem(secondsKey, '0');
    }

    const intervalId = setInterval(async () => {
      // Refresh time checks
      const currentNow = Date.now();
      const storedResetTime = parseInt(localStorage.getItem(resetKey) || '0', 10);
      if (storedResetTime !== 0 && currentNow - storedResetTime >= 24 * 60 * 60 * 1000) {
        pointsToday = 0;
        localStorage.setItem(earnedKey, '0');
        localStorage.setItem(resetKey, currentNow.toString());
        localStorage.setItem(secondsKey, '0');
        secondsSpent = 0;
      }

      // If already earned maximum of 10 points today, do nothing
      if (pointsToday >= 10) return;

      secondsSpent += 1;
      localStorage.setItem(secondsKey, secondsSpent.toString());

      if (secondsSpent >= 60) {
        secondsSpent = 0;
        localStorage.setItem(secondsKey, '0');
        
        pointsToday += 1;
        localStorage.setItem(earnedKey, pointsToday.toString());

        try {
          const userRef = doc(db, 'users', uid);
          if (isAutoSaveEnabled()) {
            await updateDoc(userRef, {
              spiritualPoints: increment(1)
            });
          }

          setPointsEarned(pointsToday);

          // Only show non-intrusive toast if not muted by user
          const muted = localStorage.getItem('asrar_mute_minute_points_toast') === 'true';
          if (!muted) {
            setShowReward(true);
            // Fast auto-dismiss after 2.5s
            setTimeout(() => {
              setShowReward(false);
            }, 2500);
          }
        } catch (error) {
          console.error("Error updating duration-based spiritual points:", error);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [user?.uid, user?.lastDailyRewardDate]);

  return (
    <AnimatePresence>
      {/* Active minute-based reward toast - Subtle, compact pill at top right */}
      {showReward && !isMuted && (
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="fixed top-16 right-4 z-[9999] bg-slate-900/95 dark:bg-slate-900/95 text-white border border-emerald-500/30 shadow-xl backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2.5 max-w-xs"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles size={13} className="text-amber-400 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-xs font-semibold text-slate-100 truncate">
              +1 Point Spirituel
              <span className="text-[11px] text-emerald-400 font-bold ml-1.5">({pointsEarned}/10)</span>
            </p>
          </div>
          <button
            onClick={handleMuteMinuteToasts}
            title="Muter ces alertes par minute"
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

      {/* Daily check-in 10 points credit toast - Refined compact card */}
      {showDaily10 && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-16 right-4 z-[9999] max-w-sm w-[calc(100vw-2rem)] bg-slate-900/95 dark:bg-slate-900/95 text-white border border-amber-500/30 shadow-2xl backdrop-blur-md rounded-2xl p-3.5 flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
              <span>+10 Points Spirituels</span>
              <span className="text-[10px] font-medium bg-amber-500/20 text-amber-200 px-1.5 py-0.2 rounded-full">Quotidien</span>
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              {t('dailyReward.daily10Desc', 'Vous avez reçu vos 10 points spirituels du jour automatiquement !')}
            </p>
          </div>
          <button 
            onClick={() => setShowDaily10(false)}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
