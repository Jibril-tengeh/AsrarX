import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { Send, Reply, ThumbsUp, Heart, Smile } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: any;
  replyTo?: string; // ID of the comment being replied to
  likes?: string[]; // Array of userIds who liked this comment
}

interface PostCommentsProps {
  postId: string;
}

const localTranslations: Record<string, Record<string, string>> = {
  fr: {
    writeComment: "Écrire un commentaire...",
    replyTo: "en réponse à",
    replyBtn: "Répondre",
    cancelReply: "Annuler la réponse",
    noComments: "Aucun commentaire pour le moment. Soyez le premier !",
    likeBtn: "J'aime",
    responseTo: "Réponse à"
  },
  en: {
    writeComment: "Write a comment...",
    replyTo: "in reply to",
    replyBtn: "Reply",
    cancelReply: "Cancel reply",
    noComments: "No comments yet. Be the first to comment!",
    likeBtn: "Like",
    responseTo: "Reply to"
  },
  ha: {
    writeComment: "Rubuta sharhi...",
    replyTo: "don mayar da martani ga",
    replyBtn: "Mayar da martani",
    cancelReply: "Soke martani",
    noComments: "Babu sharhi tukunna. Kasance na farko!",
    likeBtn: "Ina so",
    responseTo: "Martani ga"
  }
};

export const PostComments: React.FC<PostCommentsProps> = ({ postId }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const lang = language === "en" || language === "ha" ? language : "fr";
  const tLocal = (key: string) => localTranslations[lang][key] || localTranslations["fr"][key] || key;

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ["😊", "😂", "🥰", "👍", "❤️", "🙏", "🔥", "✨", "💯", "🕌", "💡", "👏"];

  useEffect(() => {
    const q = query(
      collection(db, "community_posts", postId, "comments"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Comment,
      );
      setComments(commentsData);
    }, (error) => {
      console.warn("PostComments onSnapshot error (operating offline):", error);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      await addDoc(collection(db, "community_posts", postId, "comments"), {
        authorId: user.uid,
        authorName: user.name || "Utilisateur",
        content: newComment.trim(),
        createdAt: serverTimestamp() || new Date(),
        replyTo: replyTo?.id || null,
        likes: [],
      });
      setNewComment("");
      setReplyTo(null);
      setShowEmojiPicker(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeComment = async (commentId: string, currentLikes: string[] = []) => {
    if (!user) return;
    const commentRef = doc(db, "community_posts", postId, "comments", commentId);
    
    let updatedLikes: string[];
    if (currentLikes.includes(user.uid)) {
      updatedLikes = currentLikes.filter((id) => id !== user.uid);
    } else {
      updatedLikes = [...currentLikes, user.uid];
    }

    try {
      await updateDoc(commentRef, {
        likes: updatedLikes,
      });
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleInsertEmoji = (emoji: string) => {
    setNewComment((prev) => prev + emoji);
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60">
      <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
        {comments.length === 0 ? (
          <p className="text-xs text-center py-4 text-gray-400 italic">
            {tLocal("noComments")}
          </p>
        ) : (
          comments.map((comment) => {
            const hasLiked = comment.likes?.includes(user?.uid || "") || false;
            return (
              <div
                key={comment.id}
                className={`flex gap-2 sm:gap-3 items-start transition-all ${comment.replyTo ? "ml-4 sm:ml-8 pl-1.5 sm:pl-2 border-l-2 border-emerald-500/10 dark:border-emerald-500/5" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shrink-0 text-xs font-bold shadow-sm">
                  {comment.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-2xl rounded-tl-none border border-gray-100/80 dark:border-gray-800">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate max-w-[120px]">
                          {comment.authorName}
                        </span>
                        {comment.replyTo && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md flex items-center gap-1 font-medium shrink-0">
                            <Reply size={10} /> {tLocal("replyTo")}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-gray-400 font-mono shrink-0">
                        {comment.createdAt?.seconds
                          ? new Date(comment.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : "..."}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed break-words">
                      {comment.content}
                    </p>
                  </div>
                  
                  {/* Action buttons below comment bubble */}
                  <div className="flex items-center gap-3 mt-1.5 ml-2">
                    <button
                      onClick={() => handleLikeComment(comment.id, comment.likes || [])}
                      disabled={!user}
                      className={`text-[11px] font-bold flex items-center gap-1 transition-colors hover:text-emerald-500 cursor-pointer ${
                        hasLiked ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500"
                      }`}
                    >
                      <ThumbsUp size={11} className={hasLiked ? "fill-emerald-600/10" : ""} />
                      <span>{tLocal("likeBtn")}</span>
                      {comment.likes && comment.likes.length > 0 && (
                        <span className="ml-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] px-1.5 py-0.25 rounded-full text-gray-600 dark:text-gray-350">
                          {comment.likes.length}
                        </span>
                      )}
                    </button>

                    {user && (
                      <button
                        onClick={() => setReplyTo(comment)}
                        className="text-[11px] text-gray-500 hover:text-emerald-500 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Reply size={11} />
                        <span>{tLocal("replyBtn")}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="relative mt-2">
          {replyTo && (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-2 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-xl border border-emerald-500/10">
              <span className="flex items-center gap-1.5 font-medium">
                <Reply size={12} className="rotate-180" /> {tLocal("responseTo")} <span className="font-bold">{replyTo.authorName}</span>
              </span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-gray-400 hover:text-red-500 p-0.5"
                title={tLocal("cancelReply")}
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2 relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
            >
              <Smile size={20} />
            </button>

            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={tLocal("writeComment")}
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-2xl transition-colors shadow-sm cursor-pointer hover:shadow-md shrink-0"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Quick Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute left-0 bottom-full mb-2 bg-white dark:bg-gray-850 p-2.5 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex gap-1.5 flex-wrap max-w-xs z-20">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleInsertEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </form>
      )}
    </div>
  );
};
