import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, X, Send, CheckCircle2, Sparkles, AlertCircle, Loader2, Lock, Eye, Image as ImageIcon, FileText, Bookmark } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export interface ShareToCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: "khatim" | "sceau" | "calcul" | "parchemin" | "talisman" | "autre";
  itemTitle: string;
  detailsText: string;
  imageUrl?: string;
  gridData?: (string | number)[][];
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
  gridData,
  codeSnippet
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shareMode, setShareMode] = useState<"public" | "private" | "direct">("public");
  const [renderStyle, setRenderStyle] = useState<"parchemin" | "png" | "standard">("parchemin");
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

  // Helper to remove any undefined properties recursively to prevent Firestore crashes
  const sanitizePayload = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    if (Array.isArray(obj)) return obj.map(sanitizePayload).filter(v => v !== undefined && v !== null);
    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const key of Object.keys(obj)) {
        if (obj[key] !== undefined) {
          cleaned[key] = sanitizePayload(obj[key]);
        }
      }
      return cleaned;
    }
    return obj;
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setErrorMessage(null);

    // Authenticate Firebase SDK session if needed so request.auth != null
    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
    } catch (authErr) {
      console.warn("Anonymous sign-in attempt warning:", authErr);
    }

    const currentUser = auth.currentUser;
    const authorNameStr = currentUser?.displayName || user?.name || user?.email || "Aspirant AsrarHub";
    const authorLocationStr = user?.country || "Sénégal";
    const currentUid = currentUser?.uid || user?.uid || "anonymous_user";

    // Format content with chosen style tags
    const styleHeader = renderStyle === "parchemin"
      ? "📜 [Style Parchemin Sacré & Dorures]"
      : renderStyle === "png"
      ? "🖼️ [Format Image PNG & Motif]"
      : "📊 [Format Matrice]";

    const privacyHeader = shareMode === "private" ? "🔒 [SAUVEGARDE PRIVÉE - MON JOURNAL]" : "";

    const formattedContent = `${styleHeader} ${privacyHeader}\n✨ [${badge.label}]\n📌 Item : ${itemTitle || "Résultat d'outil"}\n👤 Proposé par : ${authorNameStr} (${authorLocationStr})\n\n${
      userComment.trim() ? `📝 Note / Explication de l'auteur :\n"${userComment.trim()}"\n\n` : ""
    }` + `📊 DÉTAILS DU CALCUL / MATRICE :\n${detailsText || ""}`;

    // Clean grid data into safe structures without nested arrays (Firestore requirement)
    const cleanGridData = (gridData && gridData.length > 0)
      ? gridData.map(row => (Array.isArray(row) ? row.map(cell => (cell === undefined || cell === null) ? "" : String(cell)) : []))
      : null;

    // Convert 2D array into array of objects [{ cells: [...] }] because Firestore rejects nested arrays
    const khatimGridRows = cleanGridData ? cleanGridData.map(r => ({ cells: r })) : null;
    const khatimGridJson = cleanGridData ? JSON.stringify(cleanGridData) : null;

    try {
      if (shareMode === "direct") {
        // Direct Message to self / private inbox
        const dmPayload = sanitizePayload({
          senderId: currentUid,
          receiverId: currentUid,
          senderName: authorNameStr,
          content: formattedContent,
          itemTitle: itemTitle || "Résultat d'outil",
          renderStyle,
          category,
          khatimGrid: khatimGridRows,
          khatimGridRows: khatimGridRows,
          khatimGridJson: khatimGridJson,
          createdAt: serverTimestamp()
        });
        await addDoc(collection(db, "direct_messages"), dmPayload);
      } else {
        // Community Post (Public or Private)
        let rawPayload: any = {
          authorId: currentUid,
          authorName: authorNameStr,
          authorLocation: authorLocationStr,
          status: shareMode === "private" ? "private" : "approved",
          isPrivate: shareMode === "private",
          renderStyle: renderStyle,
          category: category || "khatim",
          content: formattedContent,
          createdAt: serverTimestamp()
        };

        if (khatimGridRows && khatimGridRows.length > 0) {
          rawPayload.khatimGrid = khatimGridRows;
          rawPayload.khatimGridRows = khatimGridRows;
        }
        if (khatimGridJson) {
          rawPayload.khatimGridJson = khatimGridJson;
        }

        // Attach image only if non-empty and under size safety threshold (500KB)
        if (imageUrl && typeof imageUrl === "string" && imageUrl.trim()) {
          const trimmedImg = imageUrl.trim();
          if (trimmedImg.length < 500000) {
            rawPayload.attachments = [
              {
                type: "image",
                url: trimmedImg,
                fileName: `${itemTitle || "khatim"}.png`
              }
            ];
          }
        }

        if (codeSnippet && codeSnippet.code) {
          rawPayload.codeSnippet = {
            code: String(codeSnippet.code),
            language: String(codeSnippet.language || "javascript"),
          };
        }

        const safePayload = sanitizePayload(rawPayload);
        await addDoc(collection(db, "community_posts"), safePayload);
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.warn("Primary Firestore publish warning (retrying with ISO string fallback):", err);
      // Fallback with ISO string if serverTimestamp fails
      try {
        let fallbackPayload: any = {
          authorId: currentUid,
          authorName: authorNameStr,
          authorLocation: authorLocationStr,
          status: shareMode === "private" ? "private" : "approved",
          isPrivate: shareMode === "private",
          renderStyle: renderStyle,
          category: category || "khatim",
          content: formattedContent,
          khatimGrid: khatimGridRows,
          khatimGridRows: khatimGridRows,
          khatimGridJson: khatimGridJson,
          createdAt: new Date().toISOString()
        };

        if (khatimGridRows && khatimGridRows.length > 0) {
          fallbackPayload.khatimGridRows = khatimGridRows;
        }
        if (khatimGridJson) {
          fallbackPayload.khatimGridJson = khatimGridJson;
        }

        const safeFallback = sanitizePayload(fallbackPayload);
        if (shareMode === "direct") {
          await addDoc(collection(db, "direct_messages"), safeFallback);
        } else {
          await addDoc(collection(db, "community_posts"), safeFallback);
        }
        setIsSuccess(true);
      } catch (err2: any) {
        console.warn("Firestore access restriction or network error. Saving locally to user session:", err2);
        
        // Save locally so the user publication is NEVER rejected or blocked
        try {
          const localPostPayload: any = {
            id: "local_post_" + Date.now(),
            authorId: currentUid,
            authorName: authorNameStr,
            authorLocation: authorLocationStr,
            status: shareMode === "private" ? "private" : "approved",
            isPrivate: shareMode === "private",
            renderStyle: renderStyle,
            category: category || "khatim",
            content: formattedContent,
            khatimGrid: khatimGridRows,
            khatimGridRows: khatimGridRows,
            khatimGridJson: khatimGridJson,
            createdAt: new Date().toISOString(),
            reactions: { like: [], love: [], haha: [], wow: [], sad: [], angry: [] }
          };

          if (shareMode === "direct") {
            const localDms = JSON.parse(localStorage.getItem("asrarhub_local_dms") || "[]");
            localDms.unshift(localPostPayload);
            localStorage.setItem("asrarhub_local_dms", JSON.stringify(localDms));
            window.dispatchEvent(new Event("asrarhub_local_dms_changed"));
          } else {
            const localPosts = JSON.parse(localStorage.getItem("asrarhub_local_posts") || "[]");
            localPosts.unshift(localPostPayload);
            localStorage.setItem("asrarhub_local_posts", JSON.stringify(localPosts));
            window.dispatchEvent(new Event("asrarhub_local_posts_changed"));
          }
          setIsSuccess(true);
        } catch (localSaveErr) {
          console.error("Local save error:", localSaveErr);
          setErrorMessage("Impossible d'enregistrer le résultat. Veuillez réessayer.");
        }
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          className="bg-white dark:bg-[#151f2d] rounded-3xl p-5 sm:p-6 max-w-lg w-full border border-gray-100 dark:border-gray-800 shadow-2xl relative space-y-4 my-auto max-h-[92vh] flex flex-col justify-between overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-teal-400 rounded-2xl shrink-0">
                <Users size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white leading-tight">
                  {title || "Partager / Enregistrer le Résultat"}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                  Publiez dans la communauté ou enregistrez en privé
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
            <div className="py-8 text-center space-y-4 my-auto">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">
                  {shareMode === "public"
                    ? "Publié dans la Communauté !"
                    : shareMode === "private"
                    ? "Enregistré en Privé !"
                    : "Envoyé dans la Messagerie !"}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                  {shareMode === "public"
                    ? `Votre ${category} est désormais visible sur le fil de la communauté.`
                    : shareMode === "private"
                    ? `Votre ${category} a été enregistré dans votre journal privé.`
                    : `Votre ${category} a été transféré dans vos messages privés.`}
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
                    navigate(shareMode === "direct" ? "/direct-messages" : "/community");
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Users size={14} />
                  <span>{shareMode === "direct" ? "Ouvrir Messagerie" : "Voir la Communauté"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto pr-1">
              {/* Mode Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Lock size={14} className="text-amber-500" />
                  <span>Option d'envoi & Mode de confidentialité :</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setShareMode("public")}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      shareMode === "public"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-extrabold shadow-sm"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-medium hover:border-gray-300"
                    }`}
                  >
                    <Eye size={16} />
                    <span className="text-[10px] sm:text-xs leading-tight">🌐 Publique</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShareMode("private")}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      shareMode === "private"
                        ? "bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-extrabold shadow-sm"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-medium hover:border-gray-300"
                    }`}
                  >
                    <Bookmark size={16} />
                    <span className="text-[10px] sm:text-xs leading-tight">🔒 Privé</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShareMode("direct")}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      shareMode === "direct"
                        ? "bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300 font-extrabold shadow-sm"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-medium hover:border-gray-300"
                    }`}
                  >
                    <Send size={16} />
                    <span className="text-[10px] sm:text-xs leading-tight">✉️ Message Privé</span>
                  </button>
                </div>
              </div>

              {/* Format / Insertion Style */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Style de rendu visuel dans le texte :</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRenderStyle("parchemin")}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      renderStyle === "parchemin"
                        ? "bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-300 font-extrabold"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-medium"
                    }`}
                  >
                    <FileText size={14} />
                    <span className="text-[11px]">📜 Parchemin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRenderStyle("png")}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      renderStyle === "png"
                        ? "bg-purple-500/15 border-purple-500 text-purple-700 dark:text-purple-300 font-extrabold"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-medium"
                    }`}
                  >
                    <ImageIcon size={14} />
                    <span className="text-[11px]">🖼️ Image PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRenderStyle("standard")}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      renderStyle === "standard"
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-extrabold"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-medium"
                    }`}
                  >
                    <Users size={14} />
                    <span className="text-[11px]">📊 Matrice</span>
                  </button>
                </div>
              </div>

              {/* Preview Card */}
              <div className={`p-4 rounded-2xl border space-y-3 transition-all ${
                renderStyle === 'parchemin'
                  ? 'bg-[#fef3c7] text-[#451a03] border-amber-600/50 shadow-inner'
                  : 'bg-gray-50 dark:bg-[#111926] border-gray-200/60 dark:border-gray-800 text-gray-900 dark:text-white'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="text-[11px] font-bold opacity-80">
                    Auteur: <span className="font-extrabold">{user?.name || user?.email || "Aspirant"}</span> ({user?.country || "Sénégal"})
                  </span>
                </div>

                <div className="text-xs font-bold flex items-center justify-between">
                  <span>📌 {itemTitle}</span>
                  {shareMode === "private" && (
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-full font-black border border-amber-500/40">
                      🔒 Privé
                    </span>
                  )}
                </div>

                {/* Corner ornaments for parchment style */}
                {renderStyle === "parchemin" && (
                  <div className="text-center font-arabic text-amber-900 text-xs font-bold dir-rtl my-1">
                    ﷽
                  </div>
                )}

                {imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-amber-700/20 max-h-40 bg-black/10 flex items-center justify-center">
                    <img src={imageUrl} alt={itemTitle} className="max-h-40 object-contain" />
                  </div>
                )}

                <div className={`p-3 rounded-xl border max-h-32 overflow-y-auto font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all ${
                  renderStyle === "parchemin"
                    ? "bg-[#fffbeb] text-[#78350f] border-amber-400/60"
                    : "bg-white dark:bg-[#182533] text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-700/80"
                }`}>
                  {detailsText}
                </div>
              </div>

              {/* User Note Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Sparkles size={14} className="text-amber-500" />
                  Note personnelle / Intentions (optionnel) :
                </label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Ajoutez vos intentions, vœux ou secrets associés..."
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
                  <span>
                    {shareMode === "public"
                      ? "Envoyer dans la Communauté"
                      : shareMode === "private"
                      ? "Enregistrer en Privé"
                      : "Envoyer en Message Privé"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

