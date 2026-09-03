import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, CheckCircle2, RefreshCw, X, AlertTriangle, Sparkles } from 'lucide-react';
import { checkToolsIntegrity, repairMissingTools, ToolsIntegrityReport } from '../utils/offlineToolsVault';
import { useLanguage } from '../contexts/LanguageContext';

export const ToolsIntegrityNotification: React.FC = () => {
  const { language } = useLanguage();
  const [report, setReport] = useState<ToolsIntegrityReport | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [fixedCount, setFixedCount] = useState<number>(0);
  const [isFixedSuccess, setIsFixedSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Run silent integrity check 2.5s after app startup
    const timer = setTimeout(async () => {
      try {
        const res = await checkToolsIntegrity();
        setReport(res);
        if (res.totalMissing > 0) {
          // Check if dismissed in this session
          const dismissed = sessionStorage.getItem('asrarhub_tools_integrity_dismissed');
          if (!dismissed) {
            setIsOpen(true);
          }
        }
      } catch (err) {
        console.warn('Silent tools integrity check:', err);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleQuickFix = async () => {
    if (isFixing) return;
    setIsFixing(true);

    try {
      const res = await repairMissingTools();
      if (res.success) {
        setFixedCount(res.repairedCount);
        setIsFixedSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
        }, 2200);
      }
    } catch (e) {
      console.error('Error repairing tools:', e);
    } finally {
      setIsFixing(false);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('asrarhub_tools_integrity_dismissed', 'true');
    } catch (e) {}
  };

  if (!isOpen || !report || report.totalMissing === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm sm:max-w-md p-5 sm:p-6 rounded-3xl bg-slate-900/98 dark:bg-slate-950/98 text-white border border-amber-500/40 shadow-2xl backdrop-blur-xl relative"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 shadow-xs">
                  {isFixedSuccess ? (
                    <CheckCircle2 size={22} className="text-emerald-400" />
                  ) : (
                    <Wrench size={22} className="animate-pulse" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      {isFixedSuccess
                        ? (language === 'en' ? 'Tools Repaired!' : language === 'ha' ? 'An gyara kayan aiki!' : 'Outils Réparés avec Succès !')
                        : (language === 'en' ? 'Tools Integrity Alert' : language === 'ha' ? 'Sanarwar Kayan Aiki' : 'Vérification d\'Intégrité des Outils')}
                    </h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {report.totalInstalled}/{report.totalRegistered}
                    </span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed pt-0.5">
                    {isFixedSuccess ? (
                      language === 'en'
                        ? `All ${fixedCount} missing tools have been installed offline.`
                        : language === 'ha'
                        ? `An shigar da dukkan kayan aiki ${fixedCount} da suka bace.`
                        : `Les ${fixedCount} outils manquants ont été installés et mis en cache.`
                    ) : (
                      language === 'en'
                        ? `${report.totalMissing} tool(s) are missing from local offline cache.`
                        : language === 'ha'
                        ? `Kayan aiki ${report.totalMissing} basu cikin wayarka don aiki offline.`
                        : `${report.totalMissing} outil(s) spirituel(s) ne sont pas encore enregistrés hors-ligne.`
                    )}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                title="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {!isFixedSuccess && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Later' : language === 'ha' ? 'Daga baya' : 'Plus tard'}
                </button>

                <button
                  type="button"
                  disabled={isFixing}
                  onClick={handleQuickFix}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {isFixing ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>{language === 'en' ? 'Installing...' : language === 'ha' ? 'Ana shigarwa...' : 'Correction...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>{language === 'en' ? 'Quick Fix (1-Click)' : language === 'ha' ? 'Gyara Nan Take' : 'Corriger (1-Clic)'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
