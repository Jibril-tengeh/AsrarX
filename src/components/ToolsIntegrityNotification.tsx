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
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[999] p-4 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 text-white border border-amber-500/40 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                {isFixedSuccess ? (
                  <CheckCircle2 size={20} className="text-emerald-400" />
                ) : (
                  <Wrench size={20} className="animate-pulse" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-white">
                    {isFixedSuccess
                      ? (language === 'en' ? 'Tools Repaired!' : language === 'ha' ? 'An gyara kayan aiki!' : 'Outils Réparés avec Succès !')
                      : (language === 'en' ? 'Tools Integrity Alert' : language === 'ha' ? 'Sanarwar Kayan Aiki' : 'Vérification d\'Intégrité des Outils')}
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {report.totalInstalled}/{report.totalRegistered}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
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
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Fermer"
            >
              <X size={16} />
            </button>
          </div>

          {!isFixedSuccess && (
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
              >
                {language === 'en' ? 'Later' : language === 'ha' ? 'Daga baya' : 'Plus tard'}
              </button>

              <button
                type="button"
                disabled={isFixing}
                onClick={handleQuickFix}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                {isFixing ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>{language === 'en' ? 'Installing...' : language === 'ha' ? 'Ana shigarwa...' : 'Correction...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>{language === 'en' ? 'Quick Fix (1-Click)' : language === 'ha' ? 'Gyara Nan Take' : 'Corriger & Télécharger (1-Clic)'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
