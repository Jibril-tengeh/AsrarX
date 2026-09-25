import React, { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFeatures } from '../../contexts/FeatureContext';
import {
  Send,
  Reply,
  ThumbsUp,
  Smile,
  Trash2,
  Lock,
  Unlock,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  LogIn,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthModal } from '../AuthModal';

export interface ArticleComment {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  content: string;
  createdAt: any;
  replyTo?: string | null;
  replyToAuthorName?: string | null;
  likes?: string[];
  isAdminComment?: boolean;
}

interface ArticleCommentsProps {
  articleId: string;
  articleTitle?: string;
  initialCommentsDisabled?: boolean;
  onCommentsDisabledChange?: (disabled: boolean) => void;
}

const adminEmails = [
  'jibriltengeh4@gmail.com',
  'sbireino@gmail.com',
  'tenibawwal10@gmail.com',
  'jibriltengeh57@gmail.com',
];

const translations: Record<string, Record<string, string>> = {
  fr: {
    title: 'Commentaires & Discussions',
    noComments: 'Aucun commentaire pour le moment. Soyez le premier à partager votre réflexion spirituelle !',
    writePlaceholder: 'Partagez votre réflexion ou posez une question...',
    replyPlaceholder: 'Écrivez votre réponse...',
    replyBtn: 'Répondre',
    replyTo: 'en réponse à',
    replyingTo: 'Réponse à',
    cancelReply: 'Annuler la réponse',
    likeBtn: "J'aime",
    loginToComment: 'Connectez-vous pour participer à la discussion spirituelle',
    loginBtn: 'Se connecter',
    commentsDisabledTitle: 'Commentaires désactivés',
    commentsDisabledNotice: 'Les commentaires ont été désactivés pour cet article par l\'administrateur.',
    adminControl: 'Administration des commentaires',
    disableComments: 'Désactiver les commentaires sur cet article',
    enableComments: 'Réactiver les commentaires',
    commentsLockedBadge: 'Verrouillé par l\'admin',
    deleteCommentTitle: 'Supprimer ce commentaire',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer définitivement ce commentaire ?',
    deleteSuccess: 'Commentaire supprimé avec succès.',
    deleteError: 'Erreur lors de la suppression.',
    adminBadge: 'Admin',
    globalDisabledNotice: 'Les commentaires sont temporairement désactivés sur la plateforme.',
    showComments: 'Afficher les commentaires',
    hideComments: 'Masquer les commentaires',
    clickToOpenDesc: 'Cliquez pour lire ou participer à la discussion',
  },
  en: {
    title: 'Comments & Discussion',
    noComments: 'No comments yet. Be the first to share your spiritual reflection!',
    writePlaceholder: 'Share your reflection or ask a question...',
    replyPlaceholder: 'Write your reply...',
    replyBtn: 'Reply',
    replyTo: 'in reply to',
    replyingTo: 'Replying to',
    cancelReply: 'Cancel reply',
    likeBtn: 'Like',
    loginToComment: 'Log in to join the spiritual discussion',
    loginBtn: 'Log in',
    commentsDisabledTitle: 'Comments disabled',
    commentsDisabledNotice: 'Comments have been disabled for this article by the administrator.',
    adminControl: 'Comments administration',
    disableComments: 'Disable comments on this article',
    enableComments: 'Re-enable comments',
    commentsLockedBadge: 'Locked by admin',
    deleteCommentTitle: 'Delete this comment',
    confirmDelete: 'Are you sure you want to permanently delete this comment?',
    deleteSuccess: 'Comment deleted successfully.',
    deleteError: 'Error during deletion.',
    adminBadge: 'Admin',
    globalDisabledNotice: 'Comments are temporarily disabled on the platform.',
    showComments: 'Show comments',
    hideComments: 'Hide comments',
    clickToOpenDesc: 'Click to read or join the discussion',
  },
  ha: {
    title: 'Sharhi da Tattaunawa',
    noComments: 'Babu sharhi tukunna. Kasance na farko da zai raba tunaninsa na addini!',
    writePlaceholder: 'Rubuta tunaninka ko ka yi tambaya...',
    replyPlaceholder: 'Rubuta martaninka...',
    replyBtn: 'Mayar da martani',
    replyTo: 'don mayar da martani ga',
    replyingTo: 'Martani ga',
    cancelReply: 'Soke martani',
    likeBtn: 'Ina so',
    loginToComment: 'Shiga asusunka don shiga tattaunawar',
    loginBtn: 'Shiga ciki',
    commentsDisabledTitle: 'An rufe sharhi',
    commentsDisabledNotice: 'Mai gudanarwa ya rufe sharhi akan wannan rubutu.',
    adminControl: 'Ikon kula da sharhi',
    disableComments: 'Rufe sharhi akan wannan rubutu',
    enableComments: 'Sake buɗe sharhi',
    commentsLockedBadge: 'Admin ya kulle',
    deleteCommentTitle: 'Goge wannan sharhi',
    confirmDelete: 'Ka tabbata kana son goge wannan sharhi dindindin?',
    deleteSuccess: 'An goge sharhi cikin nasara.',
    deleteError: 'Kuskure wajen gogewa.',
    adminBadge: 'Admin',
    globalDisabledNotice: 'An dakatar da sharhi na wucin gadi a dandalin.',
    showComments: 'Bude sharhi',
    hideComments: 'Rufe sharhi',
    clickToOpenDesc: 'Danna don karanta ko shiga tattaunawa',
  },
};

export const ArticleComments: React.FC<ArticleCommentsProps> = ({
  articleId,
  articleTitle,
  initialCommentsDisabled = false,
  onCommentsDisabledChange,
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { featureToggles } = useFeatures();

  const lang = language === 'en' || language === 'ha' ? language : 'fr';
  const tComments = (key: string) =>
    translations[lang]?.[key] || translations.fr[key] || key;

  const isAdmin = Boolean(
    user?.role === 'admin' ||
      (user?.email && adminEmails.includes(user.email.toLowerCase()))
  );

  const isGloballyDisabled = featureToggles?.disable_all_article_comments === true;

  const [comments, setComments] = useState<ArticleComment[]>(() => {
    try {
      const cached = localStorage.getItem(`asrar_comments_${articleId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [isCommentsDisabled, setIsCommentsDisabled] = useState<boolean>(
    initialCommentsDisabled
  );
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<ArticleComment | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const emojis = ['🤲', '✨', '🕌', '❤️', '💡', '📖', '🙏', '🌿', '💯', '👏', '⭐', '🕊️'];

  // Sync initialCommentsDisabled prop
  useEffect(() => {
    if (typeof initialCommentsDisabled === 'boolean') {
      setIsCommentsDisabled(initialCommentsDisabled);
    }
  }, [initialCommentsDisabled]);

  // Real-time Firestore snapshot for article comments
  useEffect(() => {
    if (!articleId) return;

    // Check article document state for commentsDisabled flag
    const articleDocRef = doc(db, 'articles', articleId);
    const unsubArticle = onSnapshot(
      articleDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (typeof data.commentsDisabled === 'boolean') {
            setIsCommentsDisabled(data.commentsDisabled);
          }
        }
      },
      (err) => {
        console.warn('Article doc commentsDisabled sync note:', err);
      }
    );

    // Comments subcollection
    const commentsRef = collection(db, 'articles', articleId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));

    const unsubComments = onSnapshot(
      q,
      (snapshot) => {
        const loaded: ArticleComment[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            authorId: data.authorId || '',
            authorName: data.authorName || 'Chercheur',
            authorEmail: data.authorEmail || '',
            authorAvatar: data.authorAvatar || '',
            content: data.content || '',
            createdAt: data.createdAt,
            replyTo: data.replyTo || null,
            replyToAuthorName: data.replyToAuthorName || null,
            likes: Array.isArray(data.likes) ? data.likes : [],
            isAdminComment: data.isAdminComment || false,
          };
        });

        setComments(loaded);
        try {
          localStorage.setItem(
            `asrar_comments_${articleId}`,
            JSON.stringify(loaded)
          );
        } catch (e) {}
      },
      (error) => {
        console.warn('Article comments onSnapshot note (using cache/offline):', error);
      }
    );

    return () => {
      unsubArticle();
      unsubComments();
    };
  }, [articleId]);

  // Organize comments: top-level parents and nested replies
  const { parentComments, repliesMap } = useMemo(() => {
    const parents: ArticleComment[] = [];
    const replies: Record<string, ArticleComment[]> = {};

    comments.forEach((c) => {
      if (!c.replyTo) {
        parents.push(c);
      } else {
        if (!replies[c.replyTo]) {
          replies[c.replyTo] = [];
        }
        replies[c.replyTo].push(c);
      }
    });

    return { parentComments: parents, repliesMap: replies };
  }, [comments]);

  // Submit comment or reply
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!newComment.trim() || isSubmitting) return;

    if (isCommentsDisabled && !isAdmin) {
      setToastMessage(tComments('commentsDisabledNotice'));
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    setIsSubmitting(true);
    try {
      const commentData = {
        articleId,
        articleTitle: articleTitle || '',
        authorId: user.uid,
        authorName: user.name || user.email?.split('@')[0] || 'Chercheur',
        authorEmail: user.email || '',
        authorAvatar: user.photoURL || '',
        content: newComment.trim(),
        createdAt: serverTimestamp(),
        replyTo: replyTo ? replyTo.id : null,
        replyToAuthorName: replyTo ? replyTo.authorName : null,
        likes: [],
        isAdminComment: isAdmin,
      };

      await addDoc(collection(db, 'articles', articleId, 'comments'), commentData);

      setNewComment('');
      setReplyTo(null);
      setShowEmojiPicker(false);
    } catch (err) {
      console.error('Error adding article comment:', err);
      setToastMessage(tComments('deleteError'));
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like / Unlike comment
  const handleLike = async (commentId: string, currentLikes: string[] = []) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const commentRef = doc(db, 'articles', articleId, 'comments', commentId);
    let updatedLikes: string[];
    if (currentLikes.includes(user.uid)) {
      updatedLikes = currentLikes.filter((uid) => uid !== user.uid);
    } else {
      updatedLikes = [...currentLikes, user.uid];
    }

    // Optimistic UI update
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: updatedLikes } : c))
    );

    try {
      await updateDoc(commentRef, { likes: updatedLikes });
    } catch (err) {
      console.warn('Error liking comment:', err);
    }
  };

  // Delete comment (Admin or Author)
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm(tComments('confirmDelete'))) return;

    setDeletingCommentId(commentId);
    try {
      await deleteDoc(doc(db, 'articles', articleId, 'comments', commentId));

      // Also clean up any replies linked to this comment
      const childReplies = comments.filter((c) => c.replyTo === commentId);
      for (const reply of childReplies) {
        try {
          await deleteDoc(doc(db, 'articles', articleId, 'comments', reply.id));
        } catch (_) {}
      }

      setComments((prev) =>
        prev.filter((c) => c.id !== commentId && c.replyTo !== commentId)
      );

      setToastMessage(tComments('deleteSuccess'));
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting comment:', err);
      setToastMessage(tComments('deleteError'));
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Admin toggle comments enabled / disabled for this article
  const handleToggleCommentsDisabled = async () => {
    if (!isAdmin || isTogglingStatus) return;

    setIsTogglingStatus(true);
    const newStatus = !isCommentsDisabled;
    setIsCommentsDisabled(newStatus);
    onCommentsDisabledChange?.(newStatus);

    try {
      const articleRef = doc(db, 'articles', articleId);
      await updateDoc(articleRef, {
        commentsDisabled: newStatus,
        commentsDisabledAt: serverTimestamp(),
        commentsDisabledBy: user?.uid || '',
      });
      setToastMessage(
        newStatus
          ? 'Commentaires désactivés sur cet article'
          : 'Commentaires réactivés sur cet article'
      );
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Error toggling commentsDisabled:', err);
      // Revert if error
      setIsCommentsDisabled(!newStatus);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleInsertEmoji = (emoji: string) => {
    setNewComment((prev) => prev + emoji);
  };

  const formatCommentDate = (val: any) => {
    if (!val) return '';
    try {
      if (typeof val === 'object' && typeof val.toDate === 'function') {
        return val.toDate().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      if (typeof val === 'object' && typeof val.seconds === 'number') {
        return new Date(val.seconds * 1000).toLocaleDateString(
          lang === 'fr' ? 'fr-FR' : 'en-US',
          {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }
        );
      }
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch (_) {}
    return '';
  };

  return (
    <section className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-900/90 text-white text-xs sm:text-sm font-medium flex items-center justify-between shadow-lg shadow-emerald-950/20 border border-emerald-500/40 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/70 hover:text-white ml-2 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Bar: Interactive Toggle Button + Admin Control */}
      <div className="bg-white dark:bg-gray-850 border border-gray-200/80 dark:border-gray-750 rounded-2xl p-3.5 sm:p-4 shadow-xs transition-all mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Main button to open/close comments */}
          <button
            type="button"
            onClick={() => setIsOpen(prev => !prev)}
            className="flex-1 flex items-center justify-between gap-3 text-left group cursor-pointer"
            aria-expanded={isOpen}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                    {tComments('title')}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold">
                    {comments.length}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {isOpen ? tComments('hideComments') : tComments('clickToOpenDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 transition-colors">
                {isOpen ? tComments('hideComments') : tComments('showComments')}
              </span>
              <div className={`p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown size={18} />
              </div>
            </div>
          </button>

          {/* Admin Controls Panel */}
          {isAdmin && (
            <div className="sm:pl-3 sm:border-l border-gray-200 dark:border-gray-700 flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <ShieldCheck size={14} />
                <span>{tComments('adminBadge')}</span>
              </div>

              <span className="h-4 w-px bg-amber-300/60 dark:bg-amber-700/60" />

              <button
                onClick={handleToggleCommentsDisabled}
                disabled={isTogglingStatus}
                className={`text-xs font-bold px-2.5 py-1 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCommentsDisabled
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    : 'bg-amber-200/80 hover:bg-amber-300/80 dark:bg-amber-900/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200'
                }`}
                title={
                  isCommentsDisabled
                    ? tComments('enableComments')
                    : tComments('disableComments')
                }
              >
                {isCommentsDisabled ? (
                  <>
                    <Unlock size={12} />
                    <span>{tComments('enableComments')}</span>
                  </>
                ) : (
                  <>
                    <Lock size={12} />
                    <span>{tComments('disableComments')}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Comments Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* Notice if comments disabled */}
            {(isCommentsDisabled || isGloballyDisabled) && (
              <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200/70 dark:border-gray-700/70 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-gray-200/70 dark:bg-gray-700 text-gray-600 dark:text-gray-300 shrink-0">
                  <Lock size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">
                    {tComments('commentsDisabledTitle')}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {isGloballyDisabled
                      ? tComments('globalDisabledNotice')
                      : tComments('commentsDisabledNotice')}
                  </p>
                </div>
              </div>
            )}

      {/* Main Comment List */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <div className="p-8 text-center bg-gray-50/50 dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <MessageSquare size={20} />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 max-w-md mx-auto">
              {tComments('noComments')}
            </p>
          </div>
        ) : (
          parentComments.map((parent) => {
            const hasLiked = parent.likes?.includes(user?.uid || '') || false;
            const canDelete =
              isAdmin || (user && user.uid === parent.authorId);
            const replies = repliesMap[parent.id] || [];

            return (
              <div key={parent.id} className="space-y-3">
                {/* Parent Comment Bubble */}
                <div className="flex gap-3 items-start group">
                  {/* Author Avatar */}
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0 text-xs font-black shadow-xs">
                    {parent.authorName?.charAt(0).toUpperCase() || 'C'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="bg-white dark:bg-gray-850 p-3.5 sm:p-4 rounded-2xl rounded-tl-none border border-gray-150 dark:border-gray-700/80 shadow-2xs">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <span className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                            {parent.authorName}
                          </span>
                          {parent.isAdminComment && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                              {tComments('adminBadge')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                            {formatCommentDate(parent.createdAt)}
                          </span>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteComment(parent.id)}
                              disabled={deletingCommentId === parent.id}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-950/30"
                              title={tComments('deleteCommentTitle')}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-800 dark:text-gray-200 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed break-words">
                        {parent.content}
                      </p>
                    </div>

                    {/* Action buttons (Like & Reply) */}
                    <div className="flex items-center gap-3.5 mt-1.5 ml-2">
                      <button
                        onClick={() => handleLike(parent.id, parent.likes || [])}
                        className={`text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          hasLiked
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                        }`}
                      >
                        <ThumbsUp
                          size={12}
                          className={hasLiked ? 'fill-emerald-600/20 stroke-emerald-600' : ''}
                        />
                        <span>{tComments('likeBtn')}</span>
                        {parent.likes && parent.likes.length > 0 && (
                          <span className="ml-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono text-gray-600 dark:text-gray-300">
                            {parent.likes.length}
                          </span>
                        )}
                      </button>

                      {(!isCommentsDisabled || isAdmin) && (
                        <button
                          onClick={() => {
                            if (!user) {
                              setShowAuthModal(true);
                              return;
                            }
                            setReplyTo(parent);
                          }}
                          className="text-[11px] text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Reply size={12} />
                          <span>{tComments('replyBtn')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nested Replies List */}
                {replies.length > 0 && (
                  <div className="pl-6 sm:pl-10 space-y-2.5 border-l-2 border-emerald-500/20 dark:border-emerald-500/10 ml-4.5">
                    {replies.map((reply) => {
                      const hasLikedReply =
                        reply.likes?.includes(user?.uid || '') || false;
                      const canDeleteReply =
                        isAdmin || (user && user.uid === reply.authorId);

                      return (
                        <div key={reply.id} className="flex gap-2.5 items-start group">
                          <div className="w-7 h-7 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200/60 dark:border-gray-700 flex items-center justify-center shrink-0 text-[11px] font-bold">
                            {reply.authorName?.charAt(0).toUpperCase() || 'R'}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="bg-gray-50 dark:bg-gray-900/90 p-3 rounded-2xl rounded-tl-none border border-gray-150 dark:border-gray-800">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                  <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
                                    {reply.authorName}
                                  </span>
                                  {reply.replyToAuthorName && (
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded-md flex items-center gap-1 font-medium shrink-0">
                                      <Reply size={9} /> {tComments('replyTo')}{' '}
                                      <span className="font-bold">
                                        {reply.replyToAuthorName}
                                      </span>
                                    </span>
                                  )}
                                  {reply.isAdminComment && (
                                    <span className="text-[9px] font-black uppercase px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                                      {tComments('adminBadge')}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[9px] text-gray-400 font-mono">
                                    {formatCommentDate(reply.createdAt)}
                                  </span>
                                  {canDeleteReply && (
                                    <button
                                      onClick={() => handleDeleteComment(reply.id)}
                                      disabled={deletingCommentId === reply.id}
                                      className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-950/30"
                                      title={tComments('deleteCommentTitle')}
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <p className="text-gray-700 dark:text-gray-300 text-xs whitespace-pre-wrap leading-relaxed break-words">
                                {reply.content}
                              </p>
                            </div>

                            {/* Reply Action buttons */}
                            <div className="flex items-center gap-3 mt-1 ml-2">
                              <button
                                onClick={() => handleLike(reply.id, reply.likes || [])}
                                className={`text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                                  hasLikedReply
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-gray-500 hover:text-emerald-600'
                                }`}
                              >
                                <ThumbsUp
                                  size={11}
                                  className={hasLikedReply ? 'fill-emerald-600/20' : ''}
                                />
                                <span>{tComments('likeBtn')}</span>
                                {reply.likes && reply.likes.length > 0 && (
                                  <span className="ml-0.5 bg-gray-100 dark:bg-gray-800 text-[9px] px-1 py-0.2 rounded-full font-mono text-gray-600 dark:text-gray-300">
                                    {reply.likes.length}
                                  </span>
                                )}
                              </button>

                              {(!isCommentsDisabled || isAdmin) && (
                                <button
                                  onClick={() => {
                                    if (!user) {
                                      setShowAuthModal(true);
                                      return;
                                    }
                                    setReplyTo(reply);
                                  }}
                                  className="text-[10px] text-gray-500 hover:text-emerald-600 font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Reply size={11} />
                                  <span>{tComments('replyBtn')}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Comment Input Box (or Login / Disabled Warning) */}
      {!user ? (
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-medium">
            <LogIn size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{tComments('loginToComment')}</span>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 shrink-0"
          >
            {tComments('loginBtn')}
          </button>
        </div>
      ) : isCommentsDisabled && !isAdmin ? (
        <div className="p-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-center text-xs text-gray-500 dark:text-gray-400 italic">
          {tComments('commentsDisabledNotice')}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative">
          {/* Replying indicator banner */}
          {replyTo && (
            <div className="text-xs text-emerald-700 dark:text-emerald-300 mb-2 flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-500/20">
              <span className="flex items-center gap-1.5 font-medium truncate">
                <Reply size={13} className="rotate-180 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {tComments('replyingTo')}{' '}
                  <strong className="font-bold">{replyTo.authorName}</strong>
                </span>
              </span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors ml-2"
                title={tComments('cancelReply')}
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 relative">
            {/* Quick Emoji toggle */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-colors cursor-pointer shrink-0"
              title="Émojis"
            >
              <Smile size={20} />
            </button>

            {/* Input field */}
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                replyTo
                  ? tComments('replyPlaceholder')
                  : tComments('writePlaceholder')
              }
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-gray-850 transition-all"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white p-2.5 rounded-2xl transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0 active:scale-95 flex items-center justify-center"
              title="Envoyer"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Quick Emoji Picker Drawer */}
          {showEmojiPicker && (
            <div className="absolute left-0 bottom-full mb-2 bg-white dark:bg-gray-850 p-2 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex gap-1.5 flex-wrap max-w-xs z-30 animate-scale-up">
              {emojis.map((emoji, idx) => (
                <button
                  key={`art-emoji-${idx}`}
                  type="button"
                  onClick={() => handleInsertEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-lg transition-transform hover:scale-125 active:scale-90 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </form>
      )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal if user tries to comment while guest */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </section>
  );
};
