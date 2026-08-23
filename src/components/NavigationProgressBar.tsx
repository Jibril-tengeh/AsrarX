import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const NavigationProgressBar: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Trigger on route change
    setLoading(true);
    setProgress(20);

    const step1 = setTimeout(() => setProgress(65), 100);
    const step2 = setTimeout(() => setProgress(90), 220);
    const step3 = setTimeout(() => {
      setProgress(100);
      const finishTimer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(finishTimer);
    }, 380);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  }, [location.pathname, location.search]);

  return (
    <AnimatePresence>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent pointer-events-none">
          <motion.div
            initial={{ width: '0%', opacity: 1 }}
            animate={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              width: { type: 'spring', stiffness: 200, damping: 25 },
              opacity: { duration: 0.25 }
            }}
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
          />
        </div>
      )}
    </AnimatePresence>
  );
};
