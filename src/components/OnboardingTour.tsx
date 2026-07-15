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
          import('firebase/firestore').then(({ updateDoc, doc }) => {
            updateDoc(doc(db, 'users', user.uid), { hasSeenTour: true }).catch(console.error);
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
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
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
      import('firebase/firestore').then(({ updateDoc, doc }) => {
        updateDoc(doc(db, 'users', user.uid), { hasSeenTour: true }).catch(console.error);
      });
    }
  };

  if (!run) return null;

  const step = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const getTooltipStyle = (): React.CSSProperties => {
    if (!coords) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
      };
    }

    const placement = step.placement || 'bottom';
    const gap = 12;
    const style: React.CSSProperties = {
      position: 'absolute',
      zIndex: 10000,
    };

    if (placement.startsWith('top')) {
      style.top = coords.top - gap;
      style.left = coords.left + coords.width / 2;
      style.transform = 'translate(-50%, -100%)';
    } else if (placement.startsWith('bottom')) {
      style.top = coords.top + coords.height + gap;
      style.left = coords.left + coords.width / 2;
      style.transform = 'translate(-50%, 0)';
    } else {
      style.top = coords.top + coords.height + gap;
      style.left = coords.left + coords.width / 2;
      style.transform = 'translate(-50%, 0)';
    }

    // Safeguard viewport bounds
    const tooltipWidth = 320;
    const padding = 16;
    if (typeof style.left === 'number') {
      const targetCenter = coords.left + coords.width / 2;
      if (targetCenter - tooltipWidth / 2 < padding) {
        style.left = padding + tooltipWidth / 2;
      } else if (targetCenter + tooltipWidth / 2 > window.innerWidth - padding) {
        style.left = window.innerWidth - padding - tooltipWidth / 2;
      }
    }

    return style;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-[9999]">
      {/* Dim overlay */}
      <div 
        className="fixed inset-0 bg-black/45 dark:bg-black/60 backdrop-blur-[0.5px] pointer-events-auto z-[9998]"
        onClick={handleEnd}
      />

      {/* Target Highlight */}
      {coords && (
        <div 
          className="absolute border-2 border-emerald-500 rounded-xl animate-pulse z-[9999] pointer-events-none shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          style={{
            top: coords.top - 4,
            left: coords.left - 4,
            width: coords.width + 8,
            height: coords.height + 8,
          }}
        />
      )}

      {/* Animated Popover */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, scale: 0.95, y: coords ? 5 : 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: coords ? -5 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={getTooltipStyle()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-w-sm w-[320px] sm:w-[340px] border border-gray-100 dark:border-gray-700 pointer-events-auto z-[10000]"
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  {currentStepIndex + 1}
                </span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  GUIDE ASRARHUB
                </h3>
              </div>
              {!step.hideCloseButton && (
                <button
                  onClick={handleEnd}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 font-medium">
              {step.content}
            </div>

            <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                {currentStepIndex > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    {t('onboardingTour.prev', 'Précédent')}
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEnd}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-2 py-1 transition-colors"
                >
                  {t('onboardingTour.skip', 'Passer')}
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                >
                  {isLastStep ? (
                    <>
                      {t('onboardingTour.finish', 'Terminer')} <Check size={16} className="ml-1.5" />
                    </>
                  ) : (
                    <>
                      {t('onboardingTour.next', 'Suivant')} <ChevronRight size={16} className="ml-1.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
