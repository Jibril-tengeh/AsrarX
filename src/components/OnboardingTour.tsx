import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { db, isAutoSaveEnabled } from '../lib/firebase';

interface Step {
  target: string;
  title?: string;
  content: string;
  placement?: 'center' | 'bottom' | 'top' | 'left' | 'right' | 'top-end';
  hideCloseButton?: boolean;
}

export const OnboardingTour: React.FC = () => {
  const [run, setRun] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { t } = useLanguage();
  const { user } = useAuth();
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const steps: Step[] = [
    {
      target: 'body',
      content: t('onboardingTour.welcome', 'Bienvenue sur AsrarHub ! Laissez-nous vous guider à travers les fonctionnalités principales de notre application.'),
      placement: 'center',
    },
    {
      target: '#tour-community',
      content: t('onboardingTour.community', 'Rejoignez la communauté pour discuter, partager et apprendre ensemble.'),
      placement: 'bottom',
    },
    {
      target: '#tour-notifications',
      content: t('onboardingTour.notifications', 'Retrouvez ici toutes vos notifications importantes et mises à jour.'),
      placement: 'bottom',
    },
    {
      target: '#tour-language',
      content: t('onboardingTour.language', 'Changez la langue de l\'application (Français, English, Hausa).'),
      placement: 'bottom',
    },
    {
      target: '#tour-theme',
      content: t('onboardingTour.theme', 'Basculez entre le mode clair et le mode sombre pour votre confort visuel.'),
      placement: 'bottom',
    },
    {
      target: '#tour-profile',
      content: t('onboardingTour.profile', 'Accédez à votre profil pour gérer vos informations et paramètres.'),
      placement: 'bottom',
    },
    {
      target: '#tour-store',
      content: t('onboardingTour.store', 'La boutique vous permet d\'acquérir des éléments premium et des accès exclusifs.'),
      placement: 'bottom',
    },
    {
      target: '#tour-lexique',
      content: t('onboardingTour.lexicon', 'Le Lexique contient les définitions et explications des termes spirituels utilisés.'),
      placement: 'bottom',
    },
    {
      target: '#tour-quran',
      content: t('onboardingTour.quran', 'Accédez au Saint Coran pour la lecture, la mémorisation et l\'écoute.'),
      placement: 'bottom',
    },
    {
      target: '#tour-search',
      content: t('onboardingTour.search', 'Recherchez rapidement un article, une recette ou un wird spécifique. Vous pouvez même utiliser l\'IA pour trouver ce qu\'il vous faut !'),
      placement: 'bottom',
    },
    {
      target: '#tour-filter',
      content: t('onboardingTour.filter', 'Filtrez les éléments affichés selon leur catégorie.'),
      placement: 'bottom',
    },
    {
      target: '#tour-layout',
      content: t('onboardingTour.viewToggle', 'Personnalisez l\'affichage des cartes selon vos préférences (Grille ou Liste).'),
      placement: 'bottom',
    },
    {
      target: '#tour-nav-home',
      content: t('onboardingTour.navHome', 'Retournez à la page d\'accueil de votre tableau de bord.'),
      placement: 'top',
    },
    {
      target: '#tour-nav-explore',
      content: t('onboardingTour.navExplore', 'Explorez de nouveaux articles et contenus publiés.'),
      placement: 'top',
    },
    {
      target: '#tour-nav-tools',
      content: t('onboardingTour.navTools', 'Accédez à des outils spirituels tels que le chapelet, le tasbih, etc.'),
      placement: 'top',
    },
    {
      target: '#tour-nav-journal',
      content: t('onboardingTour.navJournal', 'Consultez votre journal spirituel et de gratitude.'),
      placement: 'top',
    },
    {
      target: '#tour-nav-saved',
      content: t('onboardingTour.navSaved', 'Retrouvez tous vos articles et recettes sauvegardés.'),
      placement: 'top',
    },
    {
      target: '#tour-faq',
      content: t('onboardingTour.chat', 'Posez vos questions à l\'IA d\'AsrarHub et recevez des réponses basées sur nos ressources.'),
      placement: 'top-end',
    },
  ];

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = 
      localStorage.getItem('asrarhub_tour_completed') === 'true' ||
      sessionStorage.getItem('asrarhub_tour_completed') === 'true' ||
      !!(user && (user as any).hasSeenTour);

    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setRun(true);
        localStorage.setItem('asrarhub_tour_completed', 'true');
        sessionStorage.setItem('asrarhub_tour_completed', 'true');
        if (user && isAutoSaveEnabled()) {
          import('firebase/firestore').then(({ setDoc, doc }) => {
            setDoc(doc(db, 'users', user.uid), { hasSeenTour: true }, { merge: true }).catch(console.error);
          });
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    if (!run) return;
    const step = steps[currentStepIndex];
    if (step.target === 'body') {
      setCoords(null);
      return;
    }

    const updatePosition = () => {
      const el = document.querySelector(step.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          setCoords({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          });
        }, 150);
      } else {
        setCoords(null);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStepIndex, run]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleEnd();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleEnd = () => {
    setRun(false);
    localStorage.setItem('asrarhub_tour_completed', 'true');
    sessionStorage.setItem('asrarhub_tour_completed', 'true');
    if (user && isAutoSaveEnabled()) {
      import('firebase/firestore').then(({ setDoc, doc }) => {
        setDoc(doc(db, 'users', user.uid), { hasSeenTour: true }, { merge: true }).catch(console.error);
      });
    }
  };

  if (!run) return null;

  const step = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const getTooltipStyle = (): React.CSSProperties => {
    if (!coords) return {};

    const placement = step.placement || 'bottom';
    const gap = 12;
    // Ensure width fits on small smartphone screens
    const tooltipWidth = Math.min(window.innerWidth - 24, window.innerWidth < 640 ? 310 : 340);
    const padding = 12;

    const style: React.CSSProperties = {
      position: 'fixed',
      zIndex: 10000,
      width: tooltipWidth,
    };

    // Calculate left centering manually relative to the viewport
    let leftPos = coords.left + (coords.width - tooltipWidth) / 2;
    if (leftPos < padding) {
      leftPos = padding;
    } else if (leftPos + tooltipWidth > window.innerWidth - padding) {
      leftPos = window.innerWidth - padding - tooltipWidth;
    }
    style.left = leftPos;

    // Calculate top positioning
    if (placement.startsWith('top')) {
      style.top = coords.top - gap;
    } else {
      style.top = coords.top + coords.height + gap;
    }

    return style;
  };

  const renderContent = () => (
    <div className="p-5 relative overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
      {/* 3D background lighting effect */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex justify-between items-start mb-3 relative z-10" style={{ transform: 'translateZ(10px)' }}>
        <div className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white text-xs font-black shadow-md shadow-emerald-500/30 border border-white/20">
            {currentStepIndex + 1}
          </span>
          <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
            GUIDE ASRARHUB
          </h3>
        </div>
        {!step.hideCloseButton && (
          <button
            onClick={handleEnd}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/80 rounded-full transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      <div className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed mb-6 font-medium relative z-10" style={{ transform: 'translateZ(15px)' }}>
        {step.content}
      </div>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 dark:border-gray-700/80 relative z-10" style={{ transform: 'translateZ(10px)' }}>
        <div>
          {currentStepIndex > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} className="mr-1" />
              {t('onboardingTour.prev', 'Précédent')}
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleEnd}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-2 py-1 transition-colors cursor-pointer"
          >
            {t('onboardingTour.skip', 'Passer')}
          </button>
          <button
            onClick={handleNext}
            className="flex items-center px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 active:scale-95 cursor-pointer border border-emerald-400/30"
          >
            {isLastStep ? (
              <>
                {t('onboardingTour.finish', 'Terminer')} <Check size={16} className="ml-1.5 stroke-[3]" />
              </>
            ) : (
              <>
                {t('onboardingTour.next', 'Suivant')} <ChevronRight size={16} className="ml-1.5 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Dim overlay */}
      <div 
        className="fixed inset-0 bg-black/45 dark:bg-black/60 backdrop-blur-[0.5px] pointer-events-auto z-[9998]"
        onClick={handleEnd}
      />

      {/* Target Highlight */}
      {coords && (
        <div 
          className="fixed border-2 border-emerald-500 rounded-xl animate-pulse z-[9999] pointer-events-none shadow-[0_0_20px_rgba(16,185,129,0.6)]"
          style={{
            top: coords.top - 4,
            left: coords.left - 4,
            width: coords.width + 8,
            height: coords.height + 8,
          }}
        />
      )}

      {/* Animated Popover with 3D Card Depth */}
      <AnimatePresence mode="wait">
        {coords ? (
          <motion.div
            key={currentStepIndex}
            initial={{ 
              opacity: 0, 
              scale: 0.92, 
              y: step.placement?.startsWith('top') ? "-100%" : 5 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: step.placement?.startsWith('top') ? "-100%" : 0 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.92, 
              y: step.placement?.startsWith('top') ? "-100%" : -5 
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={getTooltipStyle()}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3),0_0_25px_rgba(16,185,129,0.25)] overflow-hidden border-2 border-emerald-500/30 dark:border-emerald-500/20 pointer-events-auto z-[10000] transform-gpu hover:scale-[1.01] transition-transform"
          >
            {renderContent()}
          </motion.div>
        ) : (
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-[10000]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3),0_0_25px_rgba(16,185,129,0.25)] overflow-hidden max-w-sm w-[310px] sm:w-[340px] border-2 border-emerald-500/30 dark:border-emerald-500/20 pointer-events-auto transform-gpu hover:scale-[1.01] transition-transform"
            >
              {renderContent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
