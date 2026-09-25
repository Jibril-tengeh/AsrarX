import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Share2, MessageCircle, Send, Globe, Mail } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface ToolShareData {
  id: string;
  title: string;
  description?: string;
  path: string;
  color?: string;
  icon?: any;
}

interface ToolShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: ToolShareData | null;
}

export const ToolShareModal: React.FC<ToolShareModalProps> = ({ isOpen, onClose, tool }) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !tool) return null;

  const basePath = tool.path?.startsWith('/') ? tool.path : `/${tool.path || ''}`;
  const shareUrl = `${window.location.origin}${basePath}`;
  const shareTitle = tool.title;
  const shareDesc = tool.description || 'Découvrez cet outil spirituel sur AsrarHub';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareTitle} : ${shareDesc}\n\nLien d'accès direct : `);

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
          text: `${shareTitle} : ${shareDesc}`,
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
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Fermer"
          >
            <X size={18} />
          </button>

          {/* Header with tool info */}
          <div className="flex items-center gap-3.5 mb-5 pr-8">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color || 'from-emerald-500 to-teal-600'} text-white flex items-center justify-center shadow-md shrink-0`}>
              {tool.icon ? (
                <tool.icon size={22} />
              ) : (
                <Share2 size={22} />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                {language === 'ha' ? 'Raba wannan kayan aiki' : language === 'en' ? 'Share this tool' : 'Partager cet outil'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {shareTitle}
              </p>
            </div>
          </div>

          {/* Direct Web Share button (if supported on browser) */}
          {typeof navigator !== 'undefined' && !!navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full mb-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Share2 size={17} />
              <span>
                {language === 'ha' ? 'Raba ta wayar salula' : language === 'en' ? 'Share via device apps' : 'Partager via les applications du mobile'}
              </span>
            </button>
          )}

          {/* Direct Copy Link Box */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
              {language === 'ha' ? 'Adireshin haɗi kai tsaye' : language === 'en' ? 'Direct link' : 'Lien direct vers l\'outil'}
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 select-all focus:outline-none truncate font-mono"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-750 border border-gray-200/60 dark:border-gray-700 shadow-2xs'
                }`}
              >
                {copied ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} />}
                <span>
                  {copied
                    ? (language === 'ha' ? 'An kwafa !' : language === 'en' ? 'Copied!' : 'Copié !')
                    : (language === 'ha' ? 'Kwafa' : language === 'en' ? 'Copy' : 'Copier')}
                </span>
              </button>
            </div>
          </div>

          {/* Social Quick Share Grid */}
          <div>
            <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2.5 uppercase tracking-wider">
              {language === 'ha' ? 'Tura wa abokai ta' : language === 'en' ? 'Send to friends via' : 'Envoyer directement à vos proches'}
            </span>
            <div className="grid grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodedText}${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40 transition-all hover:scale-105"
                title="WhatsApp"
              >
                <MessageCircle size={22} />
                <span className="text-[10px] font-bold mt-1">WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100/80 dark:bg-sky-950/30 dark:hover:bg-sky-950/50 text-sky-500 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/40 transition-all hover:scale-105"
                title="Telegram"
              >
                <Send size={22} />
                <span className="text-[10px] font-bold mt-1">Telegram</span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100/80 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 transition-all hover:scale-105"
                title="Facebook"
              >
                <Globe size={22} />
                <span className="text-[10px] font-bold mt-1">Facebook</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodedText}${encodedUrl}`}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-purple-50 hover:bg-purple-100/80 dark:bg-purple-950/30 dark:hover:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40 transition-all hover:scale-105"
                title="Email"
              >
                <Mail size={22} />
                <span className="text-[10px] font-bold mt-1">Email</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
