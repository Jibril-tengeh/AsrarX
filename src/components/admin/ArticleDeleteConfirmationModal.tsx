import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { getArticleImageUrl } from '../../utils/articleImageUtils';

interface ArticleDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  type: 'single' | 'bulk' | 'all';
  article?: any | null;
  count?: number;
  isDeleting?: boolean;
}

export const ArticleDeleteConfirmationModal: React.FC<ArticleDeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  article,
  count = 1,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  const articleTitle = article?.title || (article as any)?.title_fr || 'Secret sans titre';
  const articleImg = article ? getArticleImageUrl(article) : '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white dark:bg-gray-850 rounded-3xl shadow-2xl border border-red-100 dark:border-red-900/30 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="p-5 sm:p-6 bg-red-50/70 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900/30 flex items-start gap-3.5">
            <div className="p-3 bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 rounded-2xl shrink-0 shadow-xs">
              <Trash2 size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-tight">
                {type === 'single' && 'Supprimer Définitivement le Secret'}
                {type === 'bulk' && `Supprimer les ${count} Secrets Sélectionnés`}
                {type === 'all' && `Purger TOUS les Secrets (${count})`}
              </h3>
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5 font-medium flex items-center gap-1">
                <AlertTriangle size={13} className="shrink-0" />
                Action irréversible (Base de données & Stockage)
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-4">
            {type === 'single' && article && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                {articleImg ? (
                  <img
                    src={articleImg}
                    alt={articleTitle}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-750 flex items-center justify-center text-gray-400 shrink-0">
                    <Trash2 size={20} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {article.category || 'Secrets & Pratiques'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      ID: {article.id.slice(0, 8)}...
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2">
                    {articleTitle}
                  </h4>
                </div>
              </div>
            )}

            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldAlert size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Ce qui va être effectué :</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-amber-700 dark:text-amber-300">
                <li>Effacement permanent dans Firestore Cloud & API REST</li>
                <li>Nettoyage complet des caches locaux et IndexedDB</li>
                <li>Retrait immédiat des flux des utilisateurs et du coffre hors-ligne</li>
              </ul>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
              Êtes-vous certain de vouloir procéder à cette suppression ?
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={() => onConfirm()}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Suppression en cours...</span>
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  <span>Oui, Supprimer Définitivement</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
