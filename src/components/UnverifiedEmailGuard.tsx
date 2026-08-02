import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, LogOut, ShieldAlert, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export const UnverifiedEmailGuard: React.FC = () => {
  const { user, checkEmailVerification, resendVerificationEmail } = useAuth();
  const { t } = useLanguage();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleCheckVerification = async () => {
    setChecking(true);
    setStatusMessage(null);
    try {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        setStatusMessage({
          type: 'success',
          text: t('auth.emailVerifiedSuccess', 'Votre email a été vérifié avec succès ! Compte activé.')
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: t('auth.emailNotVerifiedYet', "Votre email n'est pas encore vérifié. Veuillez cliquer sur le lien d'activation reçu dans votre boîte mail (pensez à vérifier vos SPAMS).")
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || t('auth.checkError', 'Erreur lors de la vérification. Veuillez réessayer.')
      });
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setStatusMessage(null);
    try {
      await resendVerificationEmail();
      setCooldown(60);
      setStatusMessage({
        type: 'info',
        text: t('auth.resendSuccess', `Email de vérification envoyé à ${user?.email}. Vérifiez votre boîte de réception et vos spams.`)
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || t('auth.resendError', "Impossible d'envoyer l'email pour le moment. Veuillez patienter avant de réessayer.")
      });
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    const { signOut } = await import('../lib/firebase');
    await signOut();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 my-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-600" />

        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
          <Mail size={38} className="animate-pulse" />
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white dark:border-gray-900 shadow">
            <Zap size={14} />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-700 dark:text-amber-300 text-xs font-bold mb-4">
          <ShieldAlert size={14} />
          <span>Activation de compte requise</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
          Vérifiez votre adresse email
        </h2>

        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          L'accès aux outils spirituels et la lecture des articles nécessitent une adresse email vérifiée. Un lien d'activation a été envoyé à :
        </p>

        <div className="bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-2xl inline-block mb-6 max-w-full truncate font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">
          {user?.email || 'votre adresse email'}
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-left text-xs text-amber-900 dark:text-amber-200 mb-6 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 font-extrabold text-amber-800 dark:text-amber-300 text-sm uppercase tracking-wide">
            <AlertCircle size={18} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span>⚠️ Vérifiez vos dossiers de SPAM</span>
          </div>
          <p className="leading-relaxed pl-6">
            Si vous ne trouvez pas le message dans votre boîte de réception d'ici 1 à 2 minutes, pensez impérativement à vérifier votre dossier de courriers indésirables (SPAM / Junk).
          </p>
        </div>

        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3.5 rounded-2xl text-xs font-medium mb-6 text-left flex items-start gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                : statusMessage.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200'
                : 'bg-blue-50 dark:bg-blue-950/50 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
            ) : (
              <Mail size={18} className="text-blue-600 shrink-0 mt-0.5" />
            )}
            <p className="flex-1 leading-relaxed">{statusMessage.text}</p>
          </motion.div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleCheckVerification}
            disabled={checking}
            className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={18} className={checking ? 'animate-spin' : ''} />
            <span>{checking ? 'Vérification en cours...' : "J'ai vérifié mon email / Activer mon compte"}</span>
          </button>

          <button
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="w-full py-3 px-5 bg-amber-500/10 hover:bg-amber-500/20 dark:bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Mail size={16} />
            <span>
              {resending
                ? 'Envoi en cours...'
                : cooldown > 0
                ? `Renvoyer l'email (${cooldown}s)`
                : "Renvoyer l'email de vérification"}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Se déconnecter / Utiliser un autre compte</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
