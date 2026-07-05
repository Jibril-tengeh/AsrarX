import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Mail, Lock, User as UserIcon, AlertCircle, Eye, EyeOff, KeyRound, CheckCircle } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, sendVerificationEmail, auth, db, signOut } from '../lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminOnly?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, adminOnly = false }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsForgotPassword(false);
      setResetEmailSent(false);
      const savedEmail = localStorage.getItem('asrarhub_saved_email');
      const savedPassword = localStorage.getItem('asrarhub_saved_password');
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        setEmail('');
      }
      if (savedPassword) {
        setPassword(savedPassword);
      } else {
        setPassword('');
      }
    }
  }, [isOpen]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setLoading(false);
    } catch (err: any) {
      console.error("Reset password error:", err);
      if (err.code === 'auth/user-not-found') {
        setError(t('auth.userNotFound', 'Aucun utilisateur trouvé avec cette adresse email.'));
      } else if (err.code === 'auth/invalid-email') {
        setError(t('auth.invalidEmail', 'Adresse email non valide.'));
      } else {
        setError(err.message || t('auth.errorOccurred', 'Une erreur est survenue.'));
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signInWithEmail(email, password);
      } else {
        result = await signUpWithEmail(email, password, name);
        if (result?.user) {
          await setDoc(doc(db, 'users', result.user.uid), {
            email: result.user.email,
            name: name,
            role: 'user',
            createdAt: new Date()
          });
          await sendVerificationEmail(result.user);
          setVerificationSent(true);
          setLoading(false);
          return;
        }
      }

      if (result?.user) {
        if (rememberMe) {
          localStorage.setItem('asrarhub_saved_email', email);
          localStorage.setItem('asrarhub_saved_password', password);
        } else {
          localStorage.removeItem('asrarhub_saved_email');
          localStorage.removeItem('asrarhub_saved_password');
        }
        const userRef = doc(db, 'users', result.user.uid);
        const docSnap = await getDoc(userRef);
        
        let isUserAdmin = false;
        const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          isUserAdmin = true;
        } else if (result.user.email && adminEmails.includes(result.user.email.toLowerCase())) {
          // Auto-promote the specified email to admin if not already
          if (docSnap.exists()) {
             await updateDoc(userRef, { role: 'admin' });
          } else {
             await setDoc(userRef, { email: result.user.email, role: 'admin', createdAt: new Date() });
          }
          isUserAdmin = true;
        }
        
        if (adminOnly) {
          if (isUserAdmin) {
            onClose();
            navigate('/admin');
          } else {
            await signOut();
            setError(t('auth.accessDenied', "Accès refusé. Vous n'êtes pas administrateur."));
            setLoading(false);
          }
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError(t('auth.invalidCredentials', 'Email ou mot de passe incorrect.'));
      } else if (err.code === 'auth/email-already-in-use') {
        setError(t('auth.emailInUse', 'Cet email est déjà utilisé.'));
      } else if (err.code === 'auth/network-request-failed') {
        setError(t('auth.networkError', "La connexion aux serveurs d'authentification a échoué. Cela peut être dû à un adblocker ou à des restrictions d'iframe. Essayez d'ouvrir l'application dans un nouvel onglet."));
      } else {
        setError(err.message || t('auth.errorOccurred', 'Une erreur est survenue.'));
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      const result = await signInWithGoogle();
      if (result?.user) {
        const userRef = doc(db, 'users', result.user.uid);
        const docSnap = await getDoc(userRef);
        
        let isUserAdmin = false;
        const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          isUserAdmin = true;
        } else if (result.user.email && adminEmails.includes(result.user.email.toLowerCase())) {
          if (docSnap.exists()) {
             await updateDoc(userRef, { role: 'admin' });
          } else {
             await setDoc(userRef, { email: result.user.email, role: 'admin', createdAt: new Date() });
          }
          isUserAdmin = true;
        } else if (!docSnap.exists()) {
          await setDoc(userRef, { email: result.user.email, name: result.user.displayName, role: 'user', createdAt: new Date() });
        }
        
        if (adminOnly) {
          if (isUserAdmin) {
            onClose();
            navigate('/admin');
          } else {
            await signOut();
            setError(t('auth.accessDenied', "Accès refusé. Vous n'êtes pas administrateur."));
            setLoading(false);
          }
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      console.error("Google sign in error:", err);
      if (err.code === 'auth/network-request-failed') {
        setError(t('auth.networkError', "La connexion aux serveurs d'authentification a échoué. Cela peut être dû à un adblocker ou à des restrictions d'iframe. Essayez d'ouvrir l'application dans un nouvel onglet."));
      } else {
        setError(t('auth.googleError', 'Erreur lors de la connexion avec Google.'));
      }
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-y-auto max-h-[calc(100dvh-2rem)] sm:max-h-[85vh] relative border border-gray-100 dark:border-gray-800"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {isForgotPassword 
                    ? t('auth.resetPasswordTitle', 'Réinitialiser le mot de passe')
                    : adminOnly 
                      ? t('auth.administration', "Administration") 
                      : (isLogin ? t('auth.loginTitle', "Connexion") : t('auth.registerTitle', "Inscription"))
                  }
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {isForgotPassword
                    ? t('auth.resetPasswordDesc', 'Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.')
                    : adminOnly 
                      ? t('auth.adminDesc', "Connectez-vous pour accéder à l'interface d'administration.")
                      : (isLogin ? t('auth.loginDesc', "Connectez-vous à votre compte") : t('auth.registerDesc', "Créez votre compte"))
                  }
                </p>
              </div>

              {resetEmailSent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('auth.resetSuccessTitle', 'Lien envoyé !')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    {t('auth.resetSuccessDesc', 'Un email de réinitialisation a été envoyé à l\'adresse suivante :')} <span className="font-semibold">{email}</span>. {t('auth.resetSuccessAction', 'Veuillez suivre les instructions pour modifier votre mot de passe.')}
                  </p>
                  <button
                    onClick={() => {
                      setResetEmailSent(false);
                      setIsForgotPassword(false);
                      setIsLogin(true);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                  >
                    {t('auth.backToLogin', 'Retour à la connexion')}
                  </button>
                </div>
              ) : isForgotPassword ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-start gap-2">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.email', 'Email')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors mt-2"
                  >
                    {loading ? t('auth.loading', 'Chargement...') : t('auth.sendResetLink', 'Envoyer le lien de réinitialisation')}
                  </button>

                  <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setError('');
                      }}
                      className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      {t('auth.backToLogin', 'Retour à la connexion')}
                    </button>
                  </div>
                </form>
              ) : verificationSent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('auth.verifyEmailTitle', 'Vérifiez votre email')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    {t('auth.verifyEmailDesc', 'Nous avons envoyé un lien de vérification à')} <span className="font-semibold">{email}</span>. {t('auth.verifyEmailAction', 'Veuillez cliquer sur ce lien pour activer votre compte.')}
                  </p>
                  <button
                    onClick={() => {
                      setVerificationSent(false);
                      setIsLogin(true);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                  >
                    {t('auth.backToLogin', 'Retour à la connexion')}
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('auth.fullName', 'Nom complet')}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <UserIcon size={18} />
                          </div>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                            placeholder={t('auth.fullNamePlaceholder', 'Votre nom')}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('auth.email', 'Email')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('auth.password', 'Mot de passe')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock size={18} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <label className="flex items-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-700 text-emerald-600 focus:ring-emerald-500 mr-2 h-4 w-4 bg-gray-50 dark:bg-gray-800"
                        />
                        {t('auth.rememberMe', 'Se souvenir de moi')}
                      </label>

                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setError('');
                          }}
                          className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                        >
                          {t('auth.forgotPassword', 'Mot de passe oublié ?')}
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors mt-2"
                    >
                      {loading ? t('auth.loading', 'Chargement...') : (isLogin ? t('auth.login', 'Se connecter') : t('auth.register', 'S\'inscrire'))}
                    </button>

                    {!adminOnly && (
                      <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isLogin ? t('auth.noAccount', "Vous n'avez pas de compte ?") : t('auth.hasAccount', "Vous avez déjà un compte ?")}
                          <button
                            type="button"
                            onClick={() => {
                              setIsLogin(!isLogin);
                              setError('');
                            }}
                            className="ml-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                          >
                            {isLogin ? t('auth.register', "S'inscrire") : t('auth.login', "Se connecter")}
                          </button>
                        </p>
                      </div>
                    )}
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
