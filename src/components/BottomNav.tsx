import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Wrench, Compass, Bookmark, Book } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFeatures } from '../contexts/FeatureContext';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { featureToggles } = useFeatures();
  const location = useLocation();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleZenVisibility = (e: any) => {
      if (typeof e?.detail?.hidden === 'boolean') {
        setIsHidden(e.detail.hidden);
      }
    };

    window.addEventListener('zen_nav_visibility', handleZenVisibility);
    return () => window.removeEventListener('zen_nav_visibility', handleZenVisibility);
  }, []);

  // Reset visibility when route changes
  useEffect(() => {
    setIsHidden(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/user/dashboard', icon: Home, label: t('nav.home'), id: 'tour-nav-home' },
    { to: '/explore', icon: Compass, label: t('nav.explore'), id: 'tour-nav-explore', featureId: 'tool_explore' },
    { to: '/tools', icon: Wrench, label: t('nav.tools'), id: 'tour-nav-tools' },
    { to: '/journal', icon: Book, label: t('nav.journal'), id: 'tour-nav-journal', featureId: 'tool_journal' },
    { to: '/saved', icon: Bookmark, label: t('nav.saved'), id: 'tour-nav-saved' },
  ].filter(item => !item.featureId || featureToggles[item.featureId] !== 'inactive');

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-emerald-600 dark:bg-emerald-800 border-t border-emerald-700 dark:border-emerald-900 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ease-in-out ${
      isHidden ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
    }`}>
      <nav className="flex justify-around items-center px-1 h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            id={item.id}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors group ${
                isActive
                  ? 'text-white'
                  : 'text-emerald-100 hover:text-white dark:text-emerald-200 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: isActive ? 0 : -8 }}
                  whileTap={{ scale: 0.82, rotate: 15 }}
                  animate={isActive ? { scale: 1.15, rotate: 0 } : { scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 18 }}
                  className="relative flex items-center justify-center"
                >
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.span
                      layoutId="bottomNavActiveDot"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-sm"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span className={`text-[9px] font-medium transition-all duration-200 ${isActive ? 'font-bold scale-105' : 'group-hover:scale-105'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
