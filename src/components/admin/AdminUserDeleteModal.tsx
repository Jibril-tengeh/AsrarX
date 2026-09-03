import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertTriangle, X, ShieldAlert, Loader2 } from 'lucide-react';

export interface UserTarget {
  id: string;
  name?: string;
  email?: string;
  photoURL?: string;
  role?: string;
}

interface AdminUserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  user?: UserTarget | null;
  count?: number;
  isBatch?: boolean;
  isDeleting?: boolean;
}

export const AdminUserDeleteModal: React.FC<AdminUserDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  count = 1,
  isBatch = false,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  const displayName = user?.name || user?.email || 'Cet utilisateur';
  const displayEmail = user?.email || 'Email non renseigné';
  const displayAvatar = user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white dark:bg-gray-850 rounded-3xl shadow-2xl border border-red-200 dark:border-red-900/40 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="p-5 sm:p-6 bg-red-50/80 dark:bg-red-950/40 border-b border-red-100 dark:border-red-900/30 flex items-start gap-3.5">
            <div className="p-3 bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 rounded-2xl shrink-0 shadow-xs">
              <Trash2 size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-tight">
                {isBatch
                  ? `Supprimer ${count} Utilisateurs`
                  : 'Supprimer Définitivement l\'Utilisateur'}
              </h3>
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5 font-medium flex items-center gap-1">
                <AlertTriangle size={13} className="shrink-0" />
                Action irréversible (Base de données Firestore)
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-4">
            {!isBatch && user && (
              <div className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 flex items-center gap-3.5">
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-red-400/40 shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLElement).setAttribute(
                      'src',
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.id || 'usr')}`
                    );
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {displayName}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {displayEmail}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
                    ID: {user.id}
                  </p>
                </div>
              </div>
            )}

            {isBatch && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/30 text-center">
                <p className="text-3xl font-black text-red-600 dark:text-red-400 mb-1">
                  {count}
                </p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Comptes utilisateurs sélectionnés pour suppression totale.
                </p>
              </div>
            )}

            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldAlert size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Ce qui sera supprimé :</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-900/80 dark:text-amber-300/80 pl-1">
                <li>Le document utilisateur dans la collection Firestore `users`</li>
                <li>L'accès au compte et les permissions associées</li>
                <li>Le profil dans les caches locaux et listes synchronisées</li>
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Suppression en cours...</span>
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  <span>{isBatch ? `Supprimer les ${count} comptes` : 'Supprimer Définitivement'}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
