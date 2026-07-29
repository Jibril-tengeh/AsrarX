import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, 
  Wrench, 
  ShieldAlert, 
  Download, 
  X, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export type RestrictionType = 'premium' | 'maintenance' | 'blocked' | 'download_disabled' | 'phone_blocked' | null;

export interface AccessRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  restrictionType: RestrictionType;
  featureName?: string;
  language: string; // 'fr' | 'en' | 'ha'
}

export const AccessRestrictionModal: React.FC<AccessRestrictionModalProps> = ({
  isOpen,
  onClose,
  restrictionType,
  featureName,
  language = 'fr',
}) => {
  if (!isOpen || !restrictionType) return null;

  // Translations
  const content = {
    premium: {
      badge: {
        fr: 'RÉSERVÉ PREMIUM VIP',
        en: 'PREMIUM VIP ONLY',
        ha: 'RABON MEMBOBIN PREMIUM',
      },
      title: {
        fr: 'Fonctionnalité Premium Exclusive',
        en: 'Exclusive Premium Feature',
        ha: 'Fanni ne na Membobin Premium',
      },
      desc: {
        fr: `L'outil "${featureName || 'Shams al-Ma\'arif'}" est réservé aux membres Premium d'AsrarHub. Débloquez un accès illimité à tous les secrets théurgiques, tableaux d'Awfaq et calculs avancés d'Al-Buni.`,
        en: `The tool "${featureName || 'Shams al-Ma\'arif'}" is restricted to AsrarHub Premium members. Unlock unlimited access to all esoteric secrets, Awfaq matrices, and Al-Buni calculations.`,
        ha: `Wannan kayan aiki "${featureName || 'Shams al-Ma\'arif'}" na membobin Premium ne kawai. Bude hanyar samun duk sirrin Al-Buni da jadawalin Awfaq ba tare da iyaka ba.`,
      },
      icon: Crown,
      gradient: 'from-amber-500 via-yellow-500 to-amber-600',
      ringColor: 'ring-amber-500/30',
      glowColor: 'bg-amber-500/20',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      ctaText: {
        fr: 'Devenir Membre Premium',
        en: 'Upgrade to Premium',
        ha: 'Zama Memban Premium',
      },
      ctaLink: '/store',
    },

    maintenance: {
      badge: {
        fr: 'MAINTENANCE TECHNIQUE',
        en: 'TECHNICAL MAINTENANCE',
        ha: 'AINA YANA GYARA',
      },
      title: {
        fr: 'Outil Temporairement en Maintenance',
        en: 'Tool Temporarily Under Maintenance',
        ha: 'Kayan Aiki yana Gyara na Ɗan Lokaci',
      },
      desc: {
        fr: `L'outil "${featureName || 'Shams al-Ma\'arif'}" est actuellement en cours d'ajustement ou d'optimisation spirituelle par les administrateurs. Il sera de nouveau disponible très rapidement.`,
        en: `The feature "${featureName || 'Shams al-Ma\'arif'}" is currently undergoing technical or spiritual optimization. It will be restored shortly.`,
        ha: `Wannan kayan aiki "${featureName || 'Shams al-Ma\'arif'}" yana fuskantar gyara ko haɓakawa a yanzu. Zai dawo aiki nan ba da daɗewa ba.`,
      },
      icon: Wrench,
      gradient: 'from-orange-500 via-amber-500 to-yellow-600',
      ringColor: 'ring-orange-500/30',
      glowColor: 'bg-orange-500/20',
      badgeClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
      ctaText: {
        fr: 'Compris, j\'attendrai',
        en: 'Understood, I will wait',
        ha: 'Na fahimta, zan jira',
      },
      ctaLink: null,
    },

    blocked: {
      badge: {
        fr: 'ACCÈS BLOQUÉ',
        en: 'ACCESS BLOCKED',
        ha: 'AN RUFE HANYA',
      },
      title: {
        fr: 'Fonctionnalité Désactivée',
        en: 'Feature Disabled or Blocked',
        ha: 'An Kashe Wannan Kayan Aiki',
      },
      desc: {
        fr: `L'accès à "${featureName || 'cet outil'}" a été désactivé par la gestion du système. Veuillez contacter l'administration si vous pensez qu'il s'agit d'une erreur.`,
        en: `Access to "${featureName || 'this feature'}" has been disabled by the system administrator. Contact support if you believe this is an error.`,
        ha: `An rufe hanyar amfani da "${featureName || 'wannan kayan aiki'}" daga masu gudanarwa. Tuntuɓi tallafi idan kuna buƙatar ƙarin bayani.`,
      },
      icon: ShieldAlert,
      gradient: 'from-rose-600 via-red-600 to-rose-700',
      ringColor: 'ring-rose-500/30',
      glowColor: 'bg-rose-500/20',
      badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      ctaText: {
        fr: 'Contacter le Support Admin',
        en: 'Contact Support',
        ha: 'Tuntuɓi Masu Gudanarwa',
      },
      ctaLink: '/faq',
    },

    download_disabled: {
      badge: {
        fr: 'TÉLÉCHARGEMENT DÉSACTIVÉ',
        en: 'DOWNLOAD DISABLED',
        ha: 'AN KASHE ZAZZAGEWA',
      },
      title: {
        fr: 'Téléchargements Temporairement Bloqués',
        en: 'Downloads Temporarily Disabled',
        ha: 'An Rufe Zazzagewa na Ɗan Lokaci',
      },
      desc: {
        fr: `Le téléchargement pour "${featureName || 'ce document/sceau'}" a été désactivé par les administrateurs. Vous pouvez toujours consulter le contenu directement dans l'application.`,
        en: `Downloads for "${featureName || 'this document/seal'}" have been disabled by administrators. You can still view the content directly within the application.`,
        ha: `An kashe zazzagewar "${featureName || 'wannan takarda/hatimi'}" daga masu gudanarwa. Kuna iya kallo kai tsaye a cikin aikace-aikacen.`,
      },
      icon: Download,
      gradient: 'from-amber-600 via-emerald-600 to-teal-700',
      ringColor: 'ring-amber-500/30',
      glowColor: 'bg-amber-500/20',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      ctaText: {
        fr: 'Compris',
        en: 'Understood',
        ha: 'Na fahimta',
      },
      ctaLink: null,
    },

    phone_blocked: {
      badge: {
        fr: 'TÉLÉPHONE NON AUTORISÉ',
        en: 'UNAUTHORIZED PHONE',
        ha: 'WAYA BA TA DA IKO',
      },
      title: {
        fr: 'Numéro de Téléphone / Appareil Bloqué',
        en: 'Blocked Phone Device',
        ha: 'An Rufe Wannan Wayar/Lamba',
      },
      desc: {
        fr: `Votre appareil mobile ou numéro de téléphone n'est pas autorisé à accéder à l'outil "${featureName || 'Shams'}" selon la politique d'accès définie par les administrateurs.`,
        en: `Your mobile device or phone number is not permitted to access "${featureName || 'Shams'}" per administration security settings.`,
        ha: `Wannan wayar ko lambar waya ba ta da ikon shiga kayan aiki "${featureName || 'Shams'}" sakamakon dokokin masu gudanarwa.`,
      },
      icon: Lock,
      gradient: 'from-slate-700 via-gray-800 to-zinc-900',
      ringColor: 'ring-gray-500/30',
      glowColor: 'bg-gray-500/20',
      badgeClass: 'bg-gray-500/10 text-gray-600 dark:text-gray-300 border-gray-500/30',
      ctaText: {
        fr: 'Demander Déblocage',
        en: 'Request Unblock',
        ha: 'Nemi Buɗe Haniya',
      },
      ctaLink: '/faq',
    },
  }[restrictionType];

  const IconComponent = content.icon;
  const langKey = language === 'ha' ? 'ha' : language === 'en' ? 'en' : 'fr';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 z-10 overflow-hidden my-auto"
        >
          {/* Top Decorative Sparkles / Background Glow */}
          <div
            className={`absolute -top-24 -right-24 w-48 h-48 rounded-full ${content.glowColor} blur-3xl pointer-events-none`}
          />
          <div
            className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full ${content.glowColor} blur-3xl pointer-events-none`}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full bg-gray-100 dark:bg-gray-800 transition-all cursor-pointer z-20"
          >
            <X size={18} />
          </button>

          <div className="space-y-6 text-center">
            {/* Animated Icon Ring */}
            <div className="relative inline-flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr ${content.gradient} text-white flex items-center justify-center shadow-xl ring-8 ${content.ringColor}`}
              >
                <IconComponent size={40} className="drop-shadow-md" />
              </motion.div>
              <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-900 p-1.5 rounded-full shadow-md">
                <Sparkles size={16} className="text-amber-500 animate-pulse" />
              </div>
            </div>

            {/* Badge */}
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase border ${content.badgeClass}`}>
                <Sparkles size={12} />
                {content.badge[langKey]}
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white leading-tight">
                {content.title[langKey]}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto font-sans">
                {content.desc[langKey]}
              </p>
            </div>

            {/* Feature Label Highlight Box */}
            {featureName && (
              <div className="bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 rounded-2xl p-3 text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2">
                <Lock size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="truncate">{featureName}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {content.ctaLink ? (
                <Link
                  to={content.ctaLink}
                  onClick={onClose}
                  className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r ${content.gradient} hover:opacity-95 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all transform active:scale-95 cursor-pointer`}
                >
                  <span>{content.ctaText[langKey]}</span>
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className={`w-full sm:w-auto flex-1 px-6 py-3.5 bg-gradient-to-r ${content.gradient} hover:opacity-95 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all transform active:scale-95 cursor-pointer`}
                >
                  {content.ctaText[langKey]}
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {language === 'ha' ? 'Rufe' : language === 'en' ? 'Close' : 'Fermer'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
