import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Home, Wrench, Compass, Bookmark, Book, ShoppingBag, 
  Users, FileText, Calendar, Sparkles, HelpCircle, Award, BookOpen
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFeatures } from '../contexts/FeatureContext';

interface NavItemConfig {
  id: string;
  featureId: string;
  to: string;
  icon: any;
  labelKey: string;
  defaultLabel: string;
  tourId: string;
}

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

  const allAvailableNavItems: NavItemConfig[] = [
    { id: 'home', featureId: 'home', to: '/user/dashboard', icon: Home, labelKey: 'nav.home', defaultLabel: 'Accueil', tourId: 'tour-nav-home' },
    { id: 'explore', featureId: 'explore', to: '/explore', icon: Compass, labelKey: 'nav.explore', defaultLabel: 'Explore', tourId: 'tour-nav-explore' },
    { id: 'tools', featureId: 'tools', to: '/tools', icon: Wrench, labelKey: 'nav.tools', defaultLabel: 'Outils', tourId: 'tour-nav-tools' },
    { id: 'journal', featureId: 'journal', to: '/journal', icon: Book, labelKey: 'nav.journal', defaultLabel: 'Journal', tourId: 'tour-nav-journal' },
    { id: 'saved', featureId: 'saved', to: '/saved', icon: Bookmark, labelKey: 'nav.saved', defaultLabel: 'Favoris', tourId: 'tour-nav-saved' },
    { id: 'store', featureId: 'store', to: '/store', icon: ShoppingBag, labelKey: 'nav.store', defaultLabel: 'Boutique', tourId: 'tour-nav-store' },
    { id: 'community', featureId: 'community', to: '/community', icon: Users, labelKey: 'nav.community', defaultLabel: 'Communauté', tourId: 'tour-nav-community' },
    { id: 'pdf', featureId: 'pdf', to: '/pdf', icon: FileText, labelKey: 'nav.pdf', defaultLabel: 'PDF', tourId: 'tour-nav-pdf' },
    { id: 'calendar', featureId: 'calendar', to: '/tools/calendar', icon: Calendar, labelKey: 'nav.calendar', defaultLabel: 'Calendrier', tourId: 'tour-nav-calendar' },
    { id: 'ruqyah', featureId: 'ruqyah', to: '/tools/ruqyah', icon: Sparkles, labelKey: 'nav.ruqyah', defaultLabel: 'Ruqyah', tourId: 'tour-nav-ruqyah' },
    { id: 'faq', featureId: 'faq', to: '/faq', icon: HelpCircle, labelKey: 'nav.faq', defaultLabel: 'FAQ', tourId: 'tour-nav-faq' },
    { id: 'quizz', featureId: 'quizz', to: '/tools/mystic-quiz', icon: Award, labelKey: 'nav.quizz', defaultLabel: 'Quiz', tourId: 'tour-nav-quizz' },
    { id: 'lexique', featureId: 'lexique', to: '/explore/lexique', icon: BookOpen, labelKey: 'nav.lexique', defaultLabel: 'Lexique', tourId: 'tour-nav-lexique' },
  ];

  // Check if item is active/enabled in featureToggles
  const isItemActive = (item: NavItemConfig) => {
    const rawStatus = featureToggles[item.featureId];
    const toolStatus = featureToggles[`tool_${item.featureId}`];
    const status = toolStatus !== undefined ? toolStatus : rawStatus;
    if (status === 'inactive' || status === 'disabled' || status === false) return false;
    return true;
  };

  // Sort items according to custom feature_nav_order if set by administrator
  const navOrderList: string[] = Array.isArray(featureToggles?.feature_nav_order)
    ? featureToggles.feature_nav_order
    : (Array.isArray(featureToggles?.tools_order) ? featureToggles.tools_order : []);

  const sortedNavItems = [...allAvailableNavItems].sort((a, b) => {
    if (navOrderList.length === 0) return 0;
    const indexA = navOrderList.indexOf(a.id);
    const indexB = navOrderList.indexOf(b.id);
    const posA = indexA === -1 ? 9999 : indexA;
    const posB = indexB === -1 ? 9999 : indexB;
    return posA - posB;
  });

  // Filter active items and cap at 5 or 6 items max for bottom navigation bar UX
  const activeSortedItems = sortedNavItems.filter(isItemActive);
  const displayItems = activeSortedItems.slice(0, 5);

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-emerald-600 dark:bg-emerald-800 border-t border-emerald-700 dark:border-emerald-900 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ease-in-out ${
      isHidden ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
    }`}>
      <nav className="flex justify-around items-center px-1 h-16 max-w-md mx-auto">
        {displayItems.map((item, itemIdx) => {
          const label = t(item.labelKey) !== item.labelKey ? t(item.labelKey) : item.defaultLabel;
          return (
            <NavLink
              key={item.id ? `bnav-${item.id}-${itemIdx}` : `bnav-${itemIdx}`}
              to={item.to}
              id={item.tourId}
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
                  <span className={`text-[9px] font-medium transition-all duration-200 truncate max-w-[64px] text-center ${isActive ? 'font-bold scale-105' : 'group-hover:scale-105'}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
