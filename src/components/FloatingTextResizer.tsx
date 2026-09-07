import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Type, ZoomIn, ZoomOut, RotateCcw, X, Check, Sparkles } from 'lucide-react';
import { useTextScale } from '../contexts/TextScaleContext';
import { useLanguage } from '../contexts/LanguageContext';

export const FloatingTextResizer: React.FC = () => {
  const { textScale, increaseScale, decreaseScale, resetScale, setScale } = useTextScale();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const percentage = Math.round(textScale * 100);

  const presets = [
    { scale: 0.9, label: '90%', desc: language === 'ha' ? 'Kanamu' : language === 'en' ? 'Small' : 'Compact' },
    { scale: 1.0, label: '100%', desc: language === 'ha' ? 'Sada-sada' : language === 'en' ? 'Normal' : 'Normal' },
    { scale: 1.15, label: '115%', desc: language === 'ha' ? 'Babba' : language === 'en' ? 'Large' : 'Grand' },
    { scale: 1.30, label: '130%', desc: language === 'ha' ? 'Mafi babba' : language === 'en' ? 'Extra' : 'Très Grand' },
    { scale: 1.50, label: '150%', desc: language === 'ha' ? 'Mai saukin karatu' : language === 'en' ? 'Max' : 'Lecture Facile' },
  ];

  return (
    <div className="fixed bottom-20 left-4 z-40 select-none print:hidden">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-72 sm:w-80 bg-gray-900/95 dark:bg-gray-950/95 backdrop-blur-md border-2 border-amber-500/50 text-white rounded-3xl p-4 shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-emerald-600 flex items-center justify-center shadow-inner">
                  <Type size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                    {language === 'ha' ? 'Girman Rubutu' : language === 'en' ? 'Text Zoom Control' : 'Zoom & Taille du Texte'}
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    {language === 'ha' ? 'Daidaita girman rubutun littattafai da asiri' : language === 'en' ? 'Adjust reading font size dynamically' : 'Ajustez la taille pour une visibilité optimale'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center transition-colors"
                aria-label="Fermer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Main Incremental Resizer Bar */}
            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between bg-gray-950 p-2 rounded-2xl border border-gray-800">
                <button
                  type="button"
                  onClick={decreaseScale}
                  disabled={textScale <= 0.85}
                  className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-amber-600/30 disabled:opacity-40 disabled:hover:bg-gray-800 text-amber-300 font-bold text-xs flex items-center gap-1 border border-amber-500/20 transition-all active:scale-95 cursor-pointer"
                  title={language === 'ha' ? 'Rage girma' : language === 'en' ? 'Decrease font size' : 'Diminuer la taille'}
                >
                  <ZoomOut size={16} />
                  <span className="font-mono text-xs">A-</span>
                </button>

                <div className="flex flex-col items-center">
                  <span className="font-mono font-extrabold text-lg text-emerald-400">
                    {percentage}%
                  </span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest">
                    {percentage === 100 ? (language === 'ha' ? 'Daidai' : 'Standard') : `${percentage}%`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={increaseScale}
                  disabled={textScale >= 1.75}
                  className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-emerald-600/30 disabled:opacity-40 disabled:hover:bg-gray-800 text-emerald-300 font-bold text-xs flex items-center gap-1 border border-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                  title={language === 'ha' ? 'Kara girma' : language === 'en' ? 'Increase font size' : 'Augmenter la taille'}
                >
                  <span className="font-mono text-xs">A+</span>
                  <ZoomIn size={16} />
                </button>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {presets.map((preset) => {
                  const isSelected = Math.abs(textScale - preset.scale) < 0.04;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setScale(preset.scale)}
                      className={`py-1.5 px-1 rounded-xl text-center text-[10px] font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? 'bg-amber-500 text-gray-950 border-amber-400 shadow-lg shadow-amber-500/20 font-extrabold scale-105'
                          : 'bg-gray-800/80 hover:bg-gray-750 text-gray-300 border-gray-700/60'
                      }`}
                    >
                      <span>{preset.label}</span>
                      <span className="text-[8px] opacity-75 font-normal truncate max-w-full">
                        {preset.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={resetScale}
                className="flex items-center gap-1 text-gray-400 hover:text-amber-300 transition-colors py-1 px-2 rounded-lg hover:bg-gray-800"
              >
                <RotateCcw size={12} />
                <span>{language === 'ha' ? 'Mayar yadda yake' : language === 'en' ? 'Reset 100%' : 'Réinitialiser (100%)'}</span>
              </button>

              <span className="text-[10px] text-amber-400/80 flex items-center gap-1 font-arabic">
                <Sparkles size={11} />
                خط واضح
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xl backdrop-blur-md border transition-all cursor-pointer ${
              percentage !== 100
                ? 'bg-amber-500 text-gray-950 border-amber-300 font-extrabold shadow-amber-500/30'
                : 'bg-gray-900/90 text-amber-400 border-amber-500/40 hover:bg-gray-850 hover:border-amber-400'
            }`}
            title={language === 'ha' ? 'Sauya girman rubutu' : language === 'en' ? 'Text Size Resizer' : 'Ajuster la taille du texte'}
          >
            <Type size={18} className={percentage !== 100 ? 'text-gray-950' : 'text-amber-400'} />
            <span className="font-mono text-xs font-bold">
              {percentage}%
            </span>
            {percentage !== 100 && (
              <span className="w-2 h-2 rounded-full bg-emerald-950 animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
