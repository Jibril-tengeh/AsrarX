import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, Sparkles, AlertTriangle, CheckCircle2, PauseCircle, ShieldAlert, Globe } from 'lucide-react';

export type ToolStatusValue = 'active' | 'premium' | 'maintenance' | 'inactive' | 'disabled' | 'default' | 'blocked';

interface StatusOption {
  value: ToolStatusValue;
  label: string;
  shortLabel: string;
  desc: string;
  icon: React.ReactNode;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'active',
    label: 'Actif (Accessible à tous)',
    shortLabel: 'Actif',
    desc: 'Outil ouvert et disponible pour tous les utilisateurs',
    icon: <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />,
    badgeBg: 'bg-emerald-100 hover:bg-emerald-200/80 dark:bg-emerald-900/60 dark:hover:bg-emerald-900/80 border-emerald-300 dark:border-emerald-700',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    dotColor: 'bg-emerald-500'
  },
  {
    value: 'premium',
    label: 'Premium (VIP Uniquement)',
    shortLabel: 'Premium',
    desc: 'Réservé exclusivement aux abonnés VIP / Premium',
    icon: <Sparkles size={16} className="text-violet-500 shrink-0" />,
    badgeBg: 'bg-violet-100 hover:bg-violet-200/80 dark:bg-violet-900/60 dark:hover:bg-violet-900/80 border-violet-300 dark:border-violet-700',
    badgeText: 'text-violet-800 dark:text-violet-200',
    dotColor: 'bg-violet-500'
  },
  {
    value: 'maintenance',
    label: 'En Maintenance',
    shortLabel: 'Maintenance',
    desc: 'Affiche une alerte de maintenance temporaire',
    icon: <AlertTriangle size={16} className="text-amber-500 shrink-0" />,
    badgeBg: 'bg-amber-100 hover:bg-amber-200/80 dark:bg-amber-900/60 dark:hover:bg-amber-900/80 border-amber-300 dark:border-amber-700',
    badgeText: 'text-amber-800 dark:text-amber-200',
    dotColor: 'bg-amber-500'
  },
  {
    value: 'inactive',
    label: 'Inactif (Désactivé)',
    shortLabel: 'Inactif',
    desc: 'Désactivé temporairement pour tous les utilisateurs',
    icon: <PauseCircle size={16} className="text-gray-500 shrink-0" />,
    badgeBg: 'bg-gray-150 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-650 border-gray-300 dark:border-gray-600',
    badgeText: 'text-gray-800 dark:text-gray-200',
    dotColor: 'bg-gray-500'
  },
  {
    value: 'disabled',
    label: 'Bloqué / Désactivé',
    shortLabel: 'Bloqué',
    desc: 'Accès strictement verrouillé avec message d\'interdiction',
    icon: <ShieldAlert size={16} className="text-red-500 shrink-0" />,
    badgeBg: 'bg-red-100 hover:bg-red-200/80 dark:bg-red-900/60 dark:hover:bg-red-900/80 border-red-300 dark:border-red-700',
    badgeText: 'text-red-800 dark:text-red-200',
    dotColor: 'bg-red-500'
  }
];

const DEFAULT_OVERRIDE_OPTION: StatusOption = {
  value: 'default',
  label: 'Défaut (Système)',
  shortLabel: 'Défaut',
  desc: 'Suit les règles globales configurées pour tous',
  icon: <Globe size={16} className="text-blue-500 shrink-0" />,
  badgeBg: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750 border-gray-300 dark:border-gray-600',
  badgeText: 'text-gray-800 dark:text-gray-200',
  dotColor: 'bg-blue-500'
};

interface ToolStatusPickerProps {
  value: string;
  onChange: (newValue: string) => void;
  toolName?: string;
  size?: 'sm' | 'md';
  allowDefault?: boolean;
}

export const ToolStatusPicker: React.FC<ToolStatusPickerProps> = ({
  value,
  onChange,
  toolName,
  size = 'md',
  allowDefault = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  const availableOptions = allowDefault 
    ? [DEFAULT_OVERRIDE_OPTION, ...STATUS_OPTIONS]
    : STATUS_OPTIONS;

  // Normalize value
  let normalizedValue: ToolStatusValue = 'active';
  if (value === 'default' && allowDefault) {
    normalizedValue = 'default';
  } else if (value === 'blocked' || value === 'disabled') {
    normalizedValue = 'disabled';
  } else if (value === 'premium' || value === 'maintenance' || value === 'inactive' || value === 'active') {
    normalizedValue = value;
  }

  const currentOption = availableOptions.find(opt => opt.value === (value === 'default' && allowDefault ? 'default' : normalizedValue)) || availableOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSelect = (val: ToolStatusValue) => {
    onChange(val);
    setIsOpen(false);
    
    // Trigger visual success micro-animation
    setJustSaved(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setJustSaved(false);
    }, 1800);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button with smooth motion & success flash */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        animate={justSaved ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.25 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 font-bold rounded-xl border transition-all cursor-pointer shadow-xs select-none relative ${
          size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
        } ${justSaved ? 'ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-gray-900' : ''} ${currentOption.badgeBg} ${currentOption.badgeText}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={toolName ? `Modifier le statut de ${toolName}` : 'Modifier le statut'}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${currentOption.dotColor} ${justSaved ? 'animate-ping' : ''}`} />
        
        <span className="truncate max-w-[170px] sm:max-w-none">
          {currentOption.label}
        </span>

        {justSaved ? (
          <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 animate-in zoom-in-75 duration-200" />
        ) : (
          <ChevronDown 
            size={14} 
            className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </motion.button>

      {/* Popover / Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop for effortless dismissal on touch */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-2xs sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div 
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed inset-x-4 bottom-4 sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-1.5 z-50 w-auto sm:w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 p-1.5"
              role="listbox"
            >
              {toolName && (
                <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-700 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Définir l'accès :
                  </span>
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {toolName}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                {availableOptions.map((option) => {
                  const isSelected = (value === 'default' && option.value === 'default') || 
                    (option.value === normalizedValue && value !== 'default');
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer active:scale-98 ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200'
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="mt-0.5">{option.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate">
                            {option.label}
                          </span>
                          {isSelected && (
                            <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                          {option.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
