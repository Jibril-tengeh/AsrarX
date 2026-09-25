import React, { useState, useEffect, useRef } from "react";
import { FolderPlus, Folder, X, Check, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

interface BookmarkFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (folderId: string, folderName: string) => void;
  mode?: "create" | "rename";
  initialName?: string;
  folderId?: string;
  initialItemId?: string;
}

export const BookmarkFolderModal: React.FC<BookmarkFolderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "create",
  initialName = "",
  folderId,
}) => {
  const { language } = useLanguage();
  const [folderName, setFolderName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFolderName(initialName);
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 80);
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = folderName.trim();
    if (!trimmed) {
      setError(
        language === "fr"
          ? "Veuillez entrer un nom de dossier."
          : language === "ha"
          ? "Da fatan za a shigar da sunan babban fayil."
          : "Please enter a folder name."
      );
      return;
    }

    onSuccess(folderId || "", trimmed);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-850 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              {mode === "create" ? <FolderPlus size={22} /> : <Edit3 size={20} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {mode === "create"
                  ? language === "fr"
                    ? "Nouveau dossier de favoris"
                    : language === "ha"
                    ? "Sabuwar jakar adana abubuwa"
                    : "New Bookmark Folder"
                  : language === "fr"
                  ? "Renommer le dossier"
                  : language === "ha"
                  ? "Sake sunan jakar"
                  : "Rename Folder"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mode === "create"
                  ? language === "fr"
                    ? "Organisez vos secrets et articles enregistrés."
                    : language === "ha"
                    ? "Tsara asirai da labaran da aka ajiye."
                    : "Organize your saved secrets and articles."
                  : language === "fr"
                  ? "Modifiez le nom de ce dossier de favoris."
                  : language === "ha"
                  ? "Gyara sunan wannan jakar."
                  : "Update this bookmark folder name."}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                {language === "fr"
                  ? "Nom du dossier"
                  : language === "ha"
                  ? "Sunan babban fayil"
                  : "Folder Name"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Folder size={16} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={folderName}
                  onChange={(e) => {
                    setFolderName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={
                    language === "fr"
                      ? "Ex : Prières quotidiennes, Richesse, Guérison..."
                      : language === "ha"
                      ? "Misali: Addu'o'in yau da kullun, Arziki..."
                      : "e.g., Daily Dhikr, Wealth, Healing..."
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  maxLength={50}
                />
              </div>
              {error && (
                <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                {language === "fr" ? "Annuler" : language === "ha" ? "Soke" : "Cancel"}
              </button>

              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={14} className="stroke-[2.5]" />
                <span>
                  {mode === "create"
                    ? language === "fr"
                      ? "Créer le dossier"
                      : language === "ha"
                      ? "Ƙirƙiri jakar"
                      : "Create Folder"
                    : language === "fr"
                    ? "Enregistrer"
                    : language === "ha"
                    ? "Ajiye"
                    : "Save"}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
