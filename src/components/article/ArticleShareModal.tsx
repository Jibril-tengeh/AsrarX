import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Share2, MessageCircle, Send, Globe, Mail, BookOpen } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface ArticleShareData {
  id: string;
  title: string;
  hook?: string;
  category?: string;
  imageUrl?: string;
}

interface ArticleShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: ArticleShareData | null;
}

export const ArticleShareModal: React.FC<ArticleShareModalProps> = ({
  isOpen,
  onClose,
  article,
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const origin = window.location.origin;
  const shareUrl = `${origin}/secret/${article.id}`;
  const shareTitle = article.title;
  const shareDesc = article.hook || 'Découvrez cet enseignement et secret spirituel sur AsrarHub.';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareTitle}\n\n${shareDesc}\n\nLire l'article complet ici : `);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareTitle} - ${shareDesc}`,
          url: shareUrl,
        });
        onClose();
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Web Share failed:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Fermer"
          >
            <X size={18} />
          </button>

          {/* Header with article info preview */}
          <div className="flex items-start gap-3.5 mb-5 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0 overflow-hidden relative">
              {article.imageUrl ? (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <BookOpen size={22} />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {article.category || 'Article'}
              </span>
              <h3 className="text-base font-black text-gray-900 dark:text-white leading-snug line-clamp-2">
                {shareTitle}
              </h3>
              {article.hook && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                  {article.hook}
                </p>
              )}
            </div>
          </div>

          {/* Quick Native Share Button */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full mb-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98"
            >
              <Share2 size={18} />
              <span>
                {language === 'fr'
                  ? 'Partager via les applications du téléphone'
                  : language === 'ha'
                  ? 'Raba ta waya'
                  : 'Share via device apps'}
              </span>
            </button>
          )}

          {/* Social Platform Quick Links */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodedText}${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 transition-all border border-emerald-200/60 dark:border-emerald-800/40 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <MessageCircle size={20} />
              </div>
              <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">WhatsApp</span>
            </a>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-950/70 text-sky-700 dark:text-sky-300 transition-all border border-sky-200/60 dark:border-sky-800/40 group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Send size={18} />
              </div>
              <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">Telegram</span>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/70 text-blue-700 dark:text-blue-300 transition-all border border-blue-200/60 dark:border-blue-800/40 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Globe size={18} />
              </div>
              <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">Facebook</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodedText}${encodedUrl}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/70 text-purple-700 dark:text-purple-300 transition-all border border-purple-200/60 dark:border-purple-800/40 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Mail size={18} />
              </div>
              <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">Email</span>
            </a>
          </div>

          {/* Copy Direct Link Bar */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {language === 'fr' ? 'Lien direct vers cet article :' : 'Direct article link:'}
            </span>
            <div className="flex items-center gap-2 p-2 pl-3 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs font-mono text-gray-700 dark:text-gray-300 flex-1 truncate outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-white" />
                    <span>{language === 'fr' ? 'Copié !' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>{language === 'fr' ? 'Copier' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
