import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, Eye, EyeOff, AlertTriangle, FileText, RefreshCw, X, ChevronRight, Minimize2, Maximize2 } from 'lucide-react';
import { BriefcaseIcon } from './BriefcaseIcon';

export function LayoutTester() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [debugActive, setDebugActive] = useState(false);
  const [testGridCols, setTestGridCols] = useState(3);
  const [testTextLength, setTestTextLength] = useState<'short' | 'medium' | 'long' | 'unbroken'>('medium');

  // Activate debug class on document.body
  useEffect(() => {
    if (debugActive) {
      document.body.classList.add('debug-layout-overflow');
    } else {
      document.body.classList.remove('debug-layout-overflow');
    }
    return () => {
      document.body.classList.remove('debug-layout-overflow');
    };
  }, [debugActive]);

  // Check URL query parameters to auto-open
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('debug') === 'true') {
      setIsOpen(true);
    }
  }, [location.search]);

  // Sample texts for testing wrapping
  const getSampleText = () => {
    switch (testTextLength) {
      case 'short':
        return "Texte court de test.";
      case 'medium':
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
      case 'long':
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.";
      case 'unbroken':
        return "INDISSOCIABLE_SUPER_LONG_WORD_THAT_OFTEN_BREAKS_LAYOUTS_ON_MOBILE_DEVICES_BECAUSE_IT_HAS_NO_SPACES_AND_FORCES_THE_CONTAINER_TO_EXPAND_UNEXPECTEDLY_AND_UNCONTROLLABLY_HORIZONTAL_OVERFLOW_TEST";
      default:
        return "";
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-4 z-[9999] sm:bottom-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-full shadow-2xl border border-red-500"
          title="Ouvrir le Débogueur de Mise en Page (?debug=true)"
          id="layout-tester-trigger"
        >
          <BriefcaseIcon size={18} className="shrink-0" />
          <span>Inspecteur</span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-[9999] sm:bottom-4 max-w-sm w-[92vw] sm:w-96">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-red-500 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BriefcaseIcon size={18} />
              <span className="font-bold text-xs tracking-wide uppercase">Outil de Diagnostic Layout</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)} 
                className="text-white/80 hover:text-white p-0.5"
                title={isMinimized ? "Agrandir" : "Réduire"}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/80 hover:text-white p-0.5"
                title="Fermer"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Alert Note */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-3 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed flex gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div>
                  <strong>Mode d'emploi :</strong> Activez le débogueur pour repérer les éléments qui dépassent de l'écran en rouge. Modifiez les textes pour tester le wrapping.
                </div>
              </div>

              {/* Action Toggles */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Actions globales</span>
                
                <button
                  onClick={() => setDebugActive(!debugActive)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    debugActive 
                      ? 'bg-red-500 border-red-600 text-white shadow-md' 
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {debugActive ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span>Bordures de Débordement (Rouge)</span>
                  </div>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${debugActive ? 'bg-white text-red-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                    {debugActive ? 'Actif' : 'Inactif'}
                  </span>
                </button>
              </div>

              {/* Grid System Tester */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Test de Grille Interactif</span>
                
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => setTestGridCols(cols)}
                      className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                        testGridCols === cols 
                          ? 'bg-emerald-500 border-emerald-600 text-white' 
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {cols} {cols === 1 ? 'Colonne' : 'Colonnes'}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-gray-400">Longueur du texte de test :</span>
                  <div className="grid grid-cols-4 gap-1">
                    {(['short', 'medium', 'long', 'unbroken'] as const).map((len) => (
                      <button
                        key={len}
                        onClick={() => setTestTextLength(len)}
                        className={`py-1 px-1 rounded-lg text-[9px] font-semibold border capitalize transition-all ${
                          testTextLength === len 
                            ? 'bg-blue-500 border-blue-600 text-white' 
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {len === 'unbroken' ? 'Continu' : len}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Box */}
                <div className="bg-gray-50 dark:bg-gray-950 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-1.5 block">Visualisation du Wrapping</span>
                  <div className={`grid gap-2 ${
                    testGridCols === 1 ? 'grid-cols-1' : testGridCols === 2 ? 'grid-cols-2' : 'grid-cols-3'
                  }`}>
                    {Array.from({ length: testGridCols }).map((_, idx) => (
                      <div key={idx} className="bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col justify-between">
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">Boîte #{idx + 1}</div>
                        <p className="text-[10.5px] leading-relaxed text-gray-600 dark:text-gray-400 break-words overflow-hidden">
                          {getSampleText()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Layout Health Check */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-[10px]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Indicateurs de conformité</span>
                <div className="bg-gray-50 dark:bg-gray-950 p-2.5 rounded-xl space-y-1.5 text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between items-center">
                    <span>Largeur max écran :</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">{typeof window !== 'undefined' ? `${window.innerWidth}px` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Scroll horizontal global :</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Bloqué (CSS)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Hauteur de l'inspecteur :</span>
                    <span className="font-mono text-gray-500">Mobile Adaptative</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer banner */}
          <div className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-2 flex justify-between items-center text-[10px] text-gray-400 font-medium">
            <span>AsrarHub Layout Debugger v1.0</span>
            <button 
              onClick={() => {
                setDebugActive(false);
                setIsOpen(false);
              }} 
              className="text-red-500 hover:text-red-600 font-bold"
            >
              Reset & Fermer
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
