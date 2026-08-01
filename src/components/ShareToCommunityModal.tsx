import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, X, Send, CheckCircle2, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export interface ShareToCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: "khatim" | "sceau" | "calcul" | "parchemin" | "talisman" | "autre";
  itemTitle: string;
  detailsText: string;
  imageUrl?: string;
  codeSnippet?: {
    language?: string;
    code: string;
  };
}

export const ShareToCommunityModal: React.FC<ShareToCommunityModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  itemTitle,
  detailsText,
  imageUrl,
  codeSnippet
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userComment, setUserComment] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const getCategoryBadge = () => {
    switch (category) {
      case "khatim":
        return { label: "🕌 Khatim Sacred", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      case "sceau":
        return { label: "🔮 Sceau Spirituel", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" };
      case "calcul":
        return { label: "🔢 Calcul Abjad / Ilm al-Huruf", bg: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30" };
      case "parchemin":
        return { label: "📜 Parchemin Sacré", bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "talisman":
        return { label: "✨ Talisman & Charme", bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" };
      default:
        return { label: "⭐ Partage d'Outil", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
    }
  };

  const badge = getCategoryBadge();

  const handlePublish = async () => {
    setIsPublishing(true);
    setErrorMessage(null);

    const formattedContent = `✨ [Partage de la Communauté - ${badge.label}]
📌 Item : ${itemTitle}
👤 Proposé par : ${user?.name || user?.email || "Aspirant AsrarHub"} (${user?.country || "Sénégal"})

${userComment.trim() ? `📝 Note / Explication de l'auteur :\n"${userComment.trim()}"\n\n` : ""}` +
      `📊 DÉTAILS DU CALCUL / MATRICE :\n${detailsText}`;

    const payload: any = {
      authorId: user?.uid || "anonymous_user",
      authorName: user?.name || user?.email || "Aspirant",
      authorLocation: user?.country || "Sénégal",
      status: "approved",
      content: formattedContent,
      createdAt: serverTimestamp() || new Date()
    };

    if (imageUrl) {
      payload.attachments = [
        {
          type: "image",
          url: imageUrl,
          fileName: `${itemTitle}.png`
        }
      ];
    }

    if (codeSnippet) {
      payload.codeSnippet = codeSnippet;
    }

    try {
      await addDoc(collection(db, "community_posts"), payload);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Error publishing tool result to community:", err);
      setErrorMessage("Impossible de publier le résultat dans la communauté. Veuillez réessayer.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-[#151f2d] rounded-3xl p-6 max-w-lg w-full border border-gray-100 dark:border-gray-800 shadow-2xl relative space-y-5"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-teal-400 rounded-2xl">
                <Users size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                  {title || "Partager dans la Communauté"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Publiez ce résultat directement sur le fil communautaire
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">
                  Publié avec succès !
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                  Votre {category} a été partagé avec vos informations dans le fil d'actualité de la communauté.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/community");
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Users size={14} />
                  <span>Voir la Communauté</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Preview Card */}
              <div className="bg-gray-50 dark:bg-[#111926] p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    Auteur: <span className="text-emerald-600 dark:text-teal-400 font-extrabold">{user?.name || user?.email || "Aspirant"}</span> ({user?.country || "Sénégal"})
                  </span>
                </div>

                <div className="text-xs font-bold text-gray-900 dark:text-white">
                  📌 {itemTitle}
                </div>

                {imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 max-h-48 bg-black/10 flex items-center justify-center">
                    <img src={imageUrl} alt={itemTitle} className="max-h-48 object-contain" />
                  </div>
                )}

                <div className="bg-white dark:bg-[#182533] p-3 rounded-xl border border-gray-100 dark:border-gray-700/80 max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap select-all">
                  {detailsText}
                </div>
              </div>

              {/* User Note Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Sparkles size={14} className="text-amber-500" />
                  Note personnelle / Message pour la communauté (optionnel) :
                </label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Partagez vos réflexions, l'intention ou les secrets associés à ce résultat..."
                  rows={2}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={onClose}
                  disabled={isPublishing}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
                >
                  {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  <span>Envoyer dans la Communauté</span>
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
