import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Sparkles, Compass, Book, Moon, Users, DoorOpen, ChevronRight } from 'lucide-react';
import { requestAllPermissions } from '../utils/planetaryNotifications';

// Helper component for 3D card tilt and perspective effect
const Card3D: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  bgGlow?: string;
}> = ({ children, className = '', onClick, bgGlow = 'rgba(16,185,129,0.15)' }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / (rect.height / 2)) * 12,
      y: (x / (rect.width / 2)) * 12
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative rounded-3xl transition-shadow duration-300 ${className}`}
    >
      {/* Dynamic 3D aura glow on hover */}
      {isHovered && (
        <div
          className="absolute -inset-1 rounded-3xl opacity-75 blur-xl transition-all duration-500 pointer-events-none"
          style={{ background: bgGlow }}
        />
      )}
      {children}
    </motion.div>
  );
};

export const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { t, language, setLanguage } = useLanguage();
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: Sparkles,
      title: 's1_title',
      desc: 's1_desc',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/40',
      glow: 'rgba(245, 158, 11, 0.25)'
    },
    {
      icon: Compass,
      title: 's2_title',
      desc: 's2_desc',
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800/40',
      glow: 'rgba(99, 102, 241, 0.25)'
    },
    {
      icon: Book,
      title: 's3_title',
      desc: 's3_desc',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/40',
      glow: 'rgba(16, 185, 129, 0.25)'
    },
    {
      icon: Moon,
      title: 's4_title',
      desc: 's4_desc',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/40',
      glow: 'rgba(59, 130, 246, 0.25)'
    },
    {
      icon: Sparkles,
      title: 's5_title',
      desc: 's5_desc',
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800/40',
      glow: 'rgba(168, 85, 247, 0.25)'
    },
    {
      icon: Users,
      title: 's6_title',
      desc: 's6_desc',
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800/40',
      glow: 'rgba(244, 63, 94, 0.25)'
    },
    {
      icon: DoorOpen,
      title: 's7_title',
      desc: 's7_desc',
      color: 'text-teal-500',
      bg: 'bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800/40',
      glow: 'rgba(20, 184, 166, 0.25)'
    }
  ];

  const handleLanguageSelect = (lang: 'fr' | 'en' | 'ha') => {
    setLanguage(lang);
    setStep(1);
  };

  const finishOnboarding = async () => {
    try {
      await requestAllPermissions();
    } catch (e) {
      console.warn('Error requesting permissions during onboarding:', e);
    }
    onComplete();
  };

  const nextStep = () => {
    if (step < slides.length) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };

  const skip = () => {
    finishOnboarding();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background Animated Floating Stars / Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl"
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="lang-select"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full relative z-10"
          >
            {/* 3D Header Icon Container */}
            <Card3D bgGlow="rgba(16,185,129,0.3)" className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/30 border border-white/20 transform-gpu transition-all duration-300">
                <Globe className="w-12 h-12 text-white drop-shadow-md" />
              </div>
            </Card3D>

            <h1 className="text-3xl sm:text-4xl font-black tracking-widest mb-2 text-center bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500 bg-clip-text text-transparent drop-shadow-sm">
              ASRARHUB
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-center font-medium text-sm sm:text-base">
              {t('onboarding.langSelect')}
            </p>
            
            {/* 3D Interactive Language Option Cards */}
            <div className="w-full space-y-4">
              {[
                { lang: 'fr' as const, label: 'Français', flag: '🇫🇷' },
                { lang: 'en' as const, label: 'English', flag: '🇬🇧' },
                { lang: 'ha' as const, label: 'Hausa', flag: '🇳🇬' }
              ].map((item) => {
                const isSelected = language === item.lang;
                return (
                  <Card3D
                    key={item.lang}
                    onClick={() => handleLanguageSelect(item.lang)}
                    bgGlow={isSelected ? 'rgba(16,185,129,0.35)' : 'rgba(209,213,219,0.2)'}
                    className="cursor-pointer"
                  >
                    <div
                      className={`w-full p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between shadow-lg ${
                        isSelected
                          ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-teal-50 dark:from-emerald-950/60 dark:via-emerald-900/40 dark:to-teal-950/60 shadow-emerald-500/15 text-emerald-900 dark:text-emerald-100'
                          : 'border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md hover:border-emerald-300 dark:hover:border-emerald-700 shadow-gray-200/50 dark:shadow-none'
                      }`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <span className="font-bold text-lg tracking-wide" style={{ transform: 'translateZ(15px)' }}>
                        {item.label}
                      </span>
                      <span className="text-3xl transform transition-transform duration-300 hover:scale-125" style={{ transform: 'translateZ(25px)' }}>
                        {item.flag}
                      </span>
                    </div>
                  </Card3D>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`slide-${step}`}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full h-full relative z-10"
          >
            <div className="flex justify-end pt-4 h-12">
              {step < slides.length && (
                <button
                  onClick={skip}
                  className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-sm tracking-wide transition-colors cursor-pointer"
                >
                  {t('onboarding.skip')}
                </button>
              )}
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
              {(() => {
                const slide = slides[step - 1];
                const Icon = slide.icon;
                return (
                  <>
                    {/* 3D Dynamic Card Container for Slide Illustration */}
                    <Card3D bgGlow={slide.glow} className="mb-8">
                      <div
                        className={`w-36 h-36 rounded-3xl border-2 shadow-2xl flex items-center justify-center relative backdrop-blur-md ${slide.bg}`}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Inner 3D Floating Ring backdrop */}
                        <div
                          className="absolute inset-2 rounded-2xl border border-white/40 dark:border-white/10 opacity-75 pointer-events-none"
                          style={{ transform: 'translateZ(10px)' }}
                        />
                        {/* Floating 3D Main Icon */}
                        <motion.div
                          animate={{ y: [-4, 4, -4] }}
                          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                          style={{ transform: 'translateZ(30px)' }}
                        >
                          <Icon className={`w-18 h-18 ${slide.color} drop-shadow-lg`} />
                        </motion.div>
                      </div>
                    </Card3D>

                    {/* Title with depth */}
                    <motion.h2
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl sm:text-3xl font-black mb-3 tracking-tight text-gray-900 dark:text-white"
                    >
                      {t(`onboarding.${slide.title}`)}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed font-medium"
                    >
                      {t(`onboarding.${slide.desc}`)}
                    </motion.p>
                  </>
                );
              })()}
            </div>
            
            <div className="pb-10 pt-6">
              {/* Step indicator dots with 3D glow */}
              <div className="flex justify-center items-center gap-2 mb-8">
                {slides.map((_, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      width: step - 1 === idx ? 32 : 8,
                      backgroundColor: step - 1 === idx ? '#10B981' : '#D1D5DB'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`h-2.5 rounded-full shadow-sm ${
                      step - 1 === idx ? 'shadow-emerald-500/50 dark:bg-emerald-400' : 'dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              
              {/* 3D Push CTA Button */}
              <button
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white p-4 sm:p-4.5 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-md cursor-pointer border border-emerald-400/30"
              >
                <span>{step === slides.length ? t('onboarding.getStarted') : t('onboarding.continue')}</span>
                {step < slides.length && <ChevronRight size={22} className="stroke-[3]" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

