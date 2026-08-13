import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Wrench,
  ExternalLink,
  Image as ImageIcon,
  Globe,
  Database,
  SlidersHorizontal,
  Check,
  X
} from 'lucide-react';
import {
  verifyArticleImageUrls,
  runImageCorsDiagnostic,
  ImageValidationResult,
  isCapacitorEnv
} from '../../utils/imageDebugger';
import { getArticleFallbackImage, getThematicSvgPlaceholder } from '../../utils/articleImageUtils';

interface ThumbnailValidatorWidgetProps {
  articles: any[];
  onUpdateArticles?: (updated: any[]) => void;
}

export const ThumbnailValidatorWidget: React.FC<ThumbnailValidatorWidgetProps> = ({
  articles,
  onUpdateArticles
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ImageValidationResult[] | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [corsDiag, setCorsDiag] = useState<any>(null);
  const [isTestingCors, setIsTestingCors] = useState(false);
  const [autoFixedCount, setAutoFixedCount] = useState<number | null>(null);

  const handleStartScan = async () => {
    if (!articles || articles.length === 0) return;
    setIsScanning(true);
    setAutoFixedCount(null);

    try {
      const valResults = await verifyArticleImageUrls(articles);
      setResults(valResults);
    } catch (e) {
      console.error('[ThumbnailValidatorWidget] Error during scan:', e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRunCorsDiagnostic = async () => {
    setIsTestingCors(true);
    const diag = await runImageCorsDiagnostic();
    setCorsDiag(diag);
    setIsTestingCors(false);
  };

  const handleBatchFixBroken = () => {
    if (!results || !onUpdateArticles) return;

    const brokenIds = new Set(
      results
        .filter((r) => r.status === 'broken' || r.status === 'forbidden' || r.status === 'invalid_url')
        .map((r) => r.articleId)
    );

    if (brokenIds.size === 0) return;

    let fixed = 0;
    const updatedArticles = articles.map((art) => {
      if (brokenIds.has(art.id)) {
        fixed++;
        const fallback = getArticleFallbackImage(art);
        return {
          ...art,
          thumbnail: fallback,
          imageUrl: fallback
        };
      }
      return art;
    });

    onUpdateArticles(updatedArticles);
    setAutoFixedCount(fixed);

    // Re-run scan to reflect fix
    setTimeout(() => {
      handleStartScan();
    }, 500);
  };

  const filteredResults = (results || []).filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (
      searchTerm &&
      !r.articleTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !r.url.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const validCount = (results || []).filter((r) => r.status === 'valid').length;
  const brokenCount = (results || []).filter((r) => r.status === 'broken' || r.status === 'invalid_url').length;
  const forbiddenCount = (results || []).filter((r) => r.status === 'forbidden').length;
  const corsCount = (results || []).filter((r) => r.status === 'cors_issue').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
            <ImageIcon className="text-emerald-500" size={20} />
            Diagnostic & Validation des Vignettes d'Articles
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0">
            Vérifiez l'accessibilité des images dans Firestore et Firebase Storage, isolez les erreurs 403/404 et réparez les liens corrompus.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRunCorsDiagnostic}
            disabled={isTestingCors}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border-0 disabled:opacity-50"
          >
            <Globe size={14} />
            {isTestingCors ? 'Test CORS...' : 'Test Réseau CORS'}
          </button>

          <button
            onClick={handleStartScan}
            disabled={isScanning || articles.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm border-0 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            {isScanning ? 'Scan en cours...' : `Scanner ${articles.length} Articles`}
          </button>
        </div>
      </div>

      {/* Auto-Fixed Notification */}
      {autoFixedCount !== null && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>
            <strong>{autoFixedCount} vignette(s)</strong> corrompue(s) ont été remplacées avec succès par des illustrations spirituelles HD de secours.
          </span>
        </div>
      )}

      {/* CORS Diagnostic Result Card */}
      {corsDiag && (
        <div
          className={`p-4 rounded-xl border text-xs space-y-2 relative ${
            corsDiag.success
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center justify-between font-bold pr-6">
            <span className="flex items-center gap-1.5">
              <Globe size={16} /> Résultat de la vérification CORS & WebView
            </span>
            <span className="font-mono text-[11px] opacity-80">
              {isCapacitorEnv() ? 'Environnement WebView Capacitor' : 'Environnement Navigateur Web'}
            </span>
          </div>

          <button
            onClick={() => setCorsDiag(null)}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg bg-transparent border-0 cursor-pointer"
            title="Fermer ce message"
          >
            <X size={16} />
          </button>

          <p className="leading-relaxed mb-0">{corsDiag.recommendation}</p>

          <div className="flex flex-wrap gap-3 font-mono text-[10px] opacity-80 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            <span>Statut HTTP: {corsDiag.status}</span>
            <span>Type Réponse: {corsDiag.contentType || 'N/A'}</span>
            <span>Access-Control-Allow-Origin: {corsDiag.corsHeader || 'Absent'}</span>
          </div>
        </div>
      )}

      {/* Scan Results Overview Cards */}
      {results && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Valides (HTTP 200)</span>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
              <CheckCircle2 size={18} /> {validCount}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Accès Refusé (403)</span>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
              <ShieldAlert size={18} /> {forbiddenCount}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Liens Corrompus (404)</span>
            <div className="text-lg font-bold text-red-600 dark:text-red-400 mt-1 flex items-center gap-1.5">
              <AlertTriangle size={18} /> {brokenCount}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Problèmes CORS</span>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1.5">
              <Globe size={18} /> {corsCount}
            </div>
          </div>
        </div>
      )}

      {/* Controls & Search */}
      {results && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: `Tous (${results.length})` },
              { id: 'valid', label: `Valides (${validCount})` },
              { id: 'forbidden', label: `Refusés 403 (${forbiddenCount})` },
              { id: 'broken', label: `Corrompus 404 (${brokenCount})` },
              { id: 'cors_issue', label: `CORS (${corsCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border-0 cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Repair Button */}
          {(forbiddenCount > 0 || brokenCount > 0) && onUpdateArticles && (
            <button
              onClick={handleBatchFixBroken}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border-0 shadow-sm shrink-0"
            >
              <Wrench size={14} /> Réparer les {forbiddenCount + brokenCount} Vignettes Corrompues
            </button>
          )}
        </div>
      )}

      {/* Results Table */}
      {results && (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 sticky top-0 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="p-3">Article</th>
                  <th className="p-3">Statut HTTP</th>
                  <th className="p-3">Source & URL</th>
                  <th className="p-3">Détails Diagnostic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400">
                      Aucune vignette correspondant aux critères sélectionnés.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((r) => (
                    <tr key={r.articleId} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100 max-w-[180px] truncate">
                        {r.articleTitle}
                      </td>

                      <td className="p-3">
                        {r.status === 'valid' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium text-[11px]">
                            <CheckCircle2 size={12} /> Valide 200
                          </span>
                        )}
                        {r.status === 'forbidden' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium text-[11px]">
                            <ShieldAlert size={12} /> Refusé 403
                          </span>
                        )}
                        {r.status === 'broken' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 font-medium text-[11px]">
                            <AlertTriangle size={12} /> Erreur {r.httpCode || 404}
                          </span>
                        )}
                        {r.status === 'cors_issue' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-medium text-[11px]">
                            <Globe size={12} /> CORS Blocked
                          </span>
                        )}
                        {r.status === 'invalid_url' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-medium text-[11px]">
                            URL Absente
                          </span>
                        )}
                      </td>

                      <td className="p-3 max-w-[220px]">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="truncate">{r.url || 'Aucune URL'}</span>
                          {r.url.startsWith('http') && (
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
                              title="Tester directement l'URL"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="p-3 text-[11px] text-slate-600 dark:text-slate-400">
                        {r.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
