import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  X,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Info,
  CheckCircle2,
  Bug,
  Globe
} from 'lucide-react';
import {
  ImageErrorEvent,
  subscribeToImageErrors,
  getRecentImageErrors,
  clearImageErrors,
  runImageCorsDiagnostic,
  isCapacitorEnv
} from '../utils/imageDebugger';

export const ImageDebugger: React.FC = () => {
  const [currentToast, setCurrentToast] = useState<ImageErrorEvent | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [errorsList, setErrorsList] = useState<ImageErrorEvent[]>([]);
  const [corsDiagResult, setCorsDiagResult] = useState<any>(null);
  const [isTestingCors, setIsTestingCors] = useState(false);

  useEffect(() => {
    // Subscribe to image errors (logs in memory silently)
    const unsubscribe = subscribeToImageErrors(() => {
      setErrorsList(getRecentImageErrors());
    });

    setErrorsList(getRecentImageErrors());
    return () => unsubscribe();
  }, []);

  const handleRunCorsTest = async () => {
    setIsTestingCors(true);
    const res = await runImageCorsDiagnostic();
    setCorsDiagResult(res);
    setIsTestingCors(false);
  };

  if (!isOpenModal) {
    return null;
  }

  return (
    <>
      {/* Floating Toast Notification for Image Failures */}
      {currentToast && !isOpenModal && (
        <div className="fixed top-20 right-4 z-[9999] max-w-sm w-full bg-slate-900/95 border border-amber-500/50 text-white rounded-xl p-3.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
              <AlertTriangle size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-xs text-amber-300 tracking-wide uppercase flex items-center gap-1">
                  <Bug size={12} /> Image non chargée
                </span>
                <button
                  onClick={() => setCurrentToast(null)}
                  className="text-gray-400 hover:text-white p-0.5 rounded-md border-0 bg-transparent cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {currentToast.articleTitle && (
                <p className="text-xs font-semibold text-gray-200 truncate mb-1">
                  Article: {currentToast.articleTitle}
                </p>
              )}

              <p className="text-[11px] text-amber-200/90 leading-tight mb-2 line-clamp-2 font-mono">
                {currentToast.suggestedCause || 'Erreur lors du décodage de l\'URL.'}
              </p>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                <button
                  onClick={() => setIsOpenModal(true)}
                  className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 underline bg-transparent border-0 p-0 cursor-pointer flex items-center gap-1"
                >
                  <Info size={12} /> Diagnostic complet ({errorsList.length})
                </button>
                <span className="text-[10px] text-gray-500">•</span>
                <span className="text-[10px] text-gray-400">
                  HTTP {currentToast.status || 'CORS'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Badge when errors logged but toast dismissed */}
      {!currentToast && !isOpenModal && errorsList.length > 0 && (
        <button
          onClick={() => setIsOpenModal(true)}
          className="fixed bottom-24 right-4 z-[9990] bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md hover:bg-slate-800 cursor-pointer"
          title="Consulter le journal d'erreurs d'images"
        >
          <Bug size={14} className="text-amber-400 animate-pulse" />
          <span className="font-semibold text-[11px]">{errorsList.length} Erreur(s) Vignettes</span>
        </button>
      )}

      {/* Diagnostic Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white mb-0">ImageDebugger — Diagnostic Vignettes</h3>
                  <p className="text-xs text-slate-400 mb-0">
                    Interception & Analyse des échecs de chargement d'images
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg border-0 bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Environment Info Banner */}
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-medium">Environnement d'exécution :</span>{' '}
                  <span className="font-bold text-emerald-400">
                    {isCapacitorEnv() ? 'WebView Capacitor / Mobile Native' : 'Navigateur Web Standard'}
                  </span>
                </div>
                <button
                  onClick={handleRunCorsTest}
                  disabled={isTestingCors}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer border-0 disabled:opacity-50"
                >
                  <RefreshCw size={12} className={isTestingCors ? 'animate-spin' : ''} />
                  Test CORS & Réseau
                </button>
              </div>

              {/* CORS Diagnostic Result */}
              {corsDiagResult && (
                <div
                  className={`p-3.5 rounded-xl border ${
                    corsDiagResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/40 border-red-500/40 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 font-bold text-xs">
                    {corsDiagResult.success ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                      <AlertTriangle size={16} className="text-red-400" />
                    )}
                    <span>Résultat Diagnostic Réseau CORS:</span>
                  </div>
                  <p className="mb-1 text-[11px] leading-relaxed">{corsDiagResult.recommendation}</p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono opacity-80 pt-1 border-t border-slate-700/50">
                    <span>Statut: {corsDiagResult.status}</span>
                    <span>• Temps: {corsDiagResult.durationMs}ms</span>
                    <span>• Header CORS: {corsDiagResult.corsHeader || 'Absent'}</span>
                  </div>
                </div>
              )}

              {/* Recent Image Error Log */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-200 text-xs mb-0 flex items-center gap-1.5">
                    <Bug size={14} className="text-amber-400" />
                    Journal des Erreurs Interceptées ({errorsList.length})
                  </h4>
                  {errorsList.length > 0 && (
                    <button
                      onClick={() => {
                        clearImageErrors();
                        setErrorsList([]);
                        setCurrentToast(null);
                      }}
                      className="text-[11px] text-slate-400 hover:text-red-400 bg-transparent border-0 cursor-pointer"
                    >
                      Effacer le journal
                    </button>
                  )}
                </div>

                {errorsList.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 bg-slate-800/30 rounded-xl border border-slate-800">
                    <CheckCircle2 size={24} className="mx-auto mb-1 text-emerald-400 opacity-60" />
                    Aucune erreur de vignette détectée récemment.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto">
                    {errorsList.map((err) => (
                      <div
                        key={err.id}
                        className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-amber-300 truncate">
                            {err.articleTitle || 'Article sans nom'}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-300">
                            {err.status ? `HTTP ${err.status}` : 'CORS / Blocked'}
                          </span>
                        </div>

                        <div className="text-[11px] font-mono bg-slate-950/70 p-2 rounded text-slate-300 break-all select-all flex items-center justify-between gap-2">
                          <span className="truncate">{err.src}</span>
                          {err.src.startsWith('http') && (
                            <a
                              href={err.src}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 shrink-0"
                              title="Ouvrir l'URL dans un nouvel onglet"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-300 mb-0 font-medium leading-normal">
                          💡 <span className="text-amber-200/90">{err.suggestedCause}</span>
                        </p>

                        <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                          {err.isFirebaseStorage && (
                            <span className="px-1.5 py-0.5 bg-orange-950/60 text-orange-300 border border-orange-800/50 rounded">
                              Firebase Storage
                            </span>
                          )}
                          {err.isCorsError && (
                            <span className="px-1.5 py-0.5 bg-purple-950/60 text-purple-300 border border-purple-800/50 rounded">
                              Problème CORS
                            </span>
                          )}
                          {err.isBase64 && (
                            <span className="px-1.5 py-0.5 bg-blue-950/60 text-blue-300 border border-blue-800/50 rounded">
                              Base64 Encodé
                            </span>
                          )}
                          <span>{new Date(err.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-800/80 border-t border-slate-700 flex justify-between items-center">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Globe size={12} /> Les vignettes défaillantes reçoivent automatiquement un fallback spirituel SVG.
              </span>
              <button
                onClick={() => setIsOpenModal(false)}
                className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg text-xs cursor-pointer border-0 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
