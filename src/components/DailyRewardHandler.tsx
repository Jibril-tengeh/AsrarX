import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db, isAutoSaveEnabled } from '../lib/firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';

export const DailyRewardHandler: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showReward, setShowReward] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  useEffect(() => {
    if (!user) return;

    const uid = user.uid;
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
      // Refresh time checks (in case computer wakes from sleep or 24h passes during session)
      const currentNow = Date.now();
      const storedResetTime = parseInt(localStorage.getItem(resetKey) || '0', 10);
      if (storedResetTime !== 0 && currentNow - storedResetTime >= 24 * 60 * 60 * 1000) {
        pointsToday = 0;
        localStorage.setItem(earnedKey, '0');
        localStorage.setItem(resetKey, currentNow.toString());
        localStorage.setItem(secondsKey, '0');
        secondsSpent = 0;
      }

      // If already earned maximum of 5 points today, do nothing
      if (pointsToday >= 5) return;

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
          setShowReward(true);

          // Auto-hide after 5 seconds
          setTimeout(() => {
            setShowReward(false);
          }, 5000);
        } catch (error) {
          console.error("Error updating duration-based spiritual points:", error);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [user?.uid]);

  return (
    <AnimatePresence>
      {showReward && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-2xl flex items-center gap-4 text-white border border-emerald-400/30"
        >
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles className="text-yellow-300 animate-pulse" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{t('dailyReward.rewardTitle', 'Point Spirituel Gagné !')}</h3>
            <p className="text-emerald-50 text-sm">
              {t('dailyReward.rewardDesc', "Temps d'activité récompensé : {earned}/5 points aujourd'hui.").replace('{earned}', pointsEarned.toString())}
            </p>
          </div>
          <button 
            onClick={() => setShowReward(false)}
            className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
