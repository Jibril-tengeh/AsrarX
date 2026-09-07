import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Mail, Lock, User as UserIcon, AlertCircle, Eye, EyeOff, KeyRound, CheckCircle, CheckCircle2, Globe, Phone, Search, ExternalLink, Sparkles, ShieldAlert, Zap, Gift, History, UserCheck, Plus, Check } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, sendVerificationEmail, auth, db, signOut } from '../lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useAuth, setLocalUserSession } from '../contexts/AuthContext';
import { isDisposableEmail, isGmailAddress, hasGmailPlusAlias, hasEmailAlias, normalizeEmail, normalizePhone, validateRegistrationDetails } from '../lib/validationUtils';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useBackButton } from '../hooks/useBackButton';
import { findUserByReferralCode, processReferralRegistration } from '../services/referralService';
import { ReferralWelcomeModal } from './ReferralWelcomeModal';
import { getSavedLoginAccounts, saveLoginAccount, removeSavedLoginAccount, clearAllSavedLoginAccounts, SavedLoginAccount } from '../utils/loginHistory';

const countriesData = [
  { name: 'Afghanistan', code: '+93', flag: '🇦🇫' },
  { name: 'Afrique du Sud', code: '+27', flag: '🇿🇦' },
  { name: 'Albanie', code: '+355', flag: '🇦🇱' },
  { name: 'Algérie', code: '+213', flag: '🇩🇿' },
  { name: 'Allemagne', code: '+49', flag: '🇩🇪' },
  { name: 'Andorre', code: '+376', flag: '🇦🇩' },
  { name: 'Angola', code: '+244', flag: '🇦🇴' },
  { name: 'Antigua-et-Barbuda', code: '+1-268', flag: '🇦🇬' },
  { name: 'Arabie Saoudite', code: '+966', flag: '🇸🇦' },
  { name: 'Argentine', code: '+54', flag: '🇦🇷' },
  { name: 'Arménie', code: '+374', flag: '🇦🇲' },
  { name: 'Australie', code: '+61', flag: '🇦🇺' },
  { name: 'Autriche', code: '+43', flag: '🇦🇹' },
  { name: 'Azerbaïdjan', code: '+994', flag: '🇦🇿' },
  { name: 'Bahamas', code: '+1-242', flag: '🇧🇸' },
  { name: 'Bahreïn', code: '+973', flag: '🇧🇭' },
  { name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
  { name: 'Barbade', code: '+1-246', flag: '🇧🇧' },
  { name: 'Belgique', code: '+32', flag: '🇧🇪' },
  { name: 'Belize', code: '+501', flag: '🇧🇿' },
  { name: 'Bénin', code: '+229', flag: '🇧🇯' },
  { name: 'Bhoutan', code: '+975', flag: '🇧🇹' },
  { name: 'Biélorussie', code: '+375', flag: '🇧🇾' },
  { name: 'Birmanie (Myanmar)', code: '+95', flag: '🇲🇲' },
  { name: 'Bolivie', code: '+591', flag: '🇧🇴' },
  { name: 'Bosnie-Herzégovine', code: '+387', flag: '🇧🇦' },
  { name: 'Botswana', code: '+267', flag: '🇧🇼' },
  { name: 'Brésil', code: '+55', flag: '🇧🇷' },
  { name: 'Brunei', code: '+673', flag: '🇧🇳' },
  { name: 'Bulgarie', code: '+359', flag: '🇧🇬' },
  { name: 'Burkina Faso', code: '+226', flag: '🇧🇫' },
  { name: 'Burundi', code: '+257', flag: '🇧🇮' },
  { name: 'Cambodge', code: '+855', flag: '🇰🇭' },
  { name: 'Cameroun', code: '+237', flag: '🇨🇲' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Cap-Vert', code: '+238', flag: '🇨🇻' },
  { name: 'Centrafrique', code: '+236', flag: '🇨🇫' },
  { name: 'Chili', code: '+56', flag: '🇨🇱' },
  { name: 'Chine', code: '+86', flag: '🇨🇳' },
  { name: 'Chypre', code: '+357', flag: '🇨🇾' },
  { name: 'Colombie', code: '+57', flag: '🇨🇴' },
  { name: 'Comores', code: '+269', flag: '🇰🇲' },
  { name: 'Congo-Brazzaville', code: '+242', flag: '🇨🇬' },
  { name: 'Congo-Kinshasa (RDC)', code: '+243', flag: '🇨🇩' },
  { name: 'Corée du Nord', code: '+850', flag: '🇰🇵' },
  { name: 'Corée du Sud', code: '+82', flag: '🇰🇷' },
  { name: 'Costa Rica', code: '+506', flag: '🇨🇷' },
  { name: 'Côte d’Ivoire', code: '+225', flag: '🇨🇮' },
  { name: 'Croatie', code: '+385', flag: '🇭🇷' },
  { name: 'Cuba', code: '+53', flag: '🇨🇺' },
  { name: 'Danemark', code: '+45', flag: '🇩🇰' },
  { name: 'Djibouti', code: '+253', flag: '🇩🇯' },
  { name: 'Dominique', code: '+1-767', flag: '🇩🇲' },
  { name: 'Égypte', code: '+20', flag: '🇪🇬' },
  { name: 'Émirats Arabes Unis', code: '+971', flag: '🇦🇪' },
  { name: 'Équateur', code: '+593', flag: '🇪🇨' },
  { name: 'Érythrée', code: '+291', flag: '🇪🇷' },
  { name: 'Espagne', code: '+34', flag: '🇪🇸' },
  { name: 'Estonie', code: '+372', flag: '🇪🇪' },
  { name: 'Eswatini', code: '+268', flag: '🇸🇿' },
  { name: 'États-Unis', code: '+1', flag: '🇺🇸' },
  { name: 'Éthiopie', code: '+251', flag: '🇪🇹' },
  { name: 'Fidji', code: '+679', flag: '🇫🇯' },
  { name: 'Finlande', code: '+358', flag: '🇫🇮' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Gabon', code: '+241', flag: '🇬🇦' },
  { name: 'Gambie', code: '+220', flag: '🇬🇲' },
  { name: 'Géorgie', code: '+995', flag: '🇬🇪' },
  { name: 'Ghana', code: '+233', flag: '🇬🇭' },
  { name: 'Grèce', code: '+30', flag: '🇬🇷' },
  { name: 'Grenade', code: '+1-473', flag: '🇬🇩' },
  { name: 'Guatemala', code: '+502', flag: '🇬🇹' },
  { name: 'Guinée', code: '+224', flag: '🇬🇳' },
  { name: 'Guinée-Bissau', code: '+245', flag: '🇬🇼' },
  { name: 'Guinée Équatoriale', code: '+240', flag: '🇬🇶' },
  { name: 'Guyana', code: '+592', flag: '🇬🇾' },
  { name: 'Haïti', code: '+509', flag: '🇭🇹' },
  { name: 'Honduras', code: '+504', flag: '🇭🇳' },
  { name: 'Hongrie', code: '+36', flag: '🇭🇺' },
  { name: 'Inde', code: '+91', flag: '🇮🇳' },
  { name: 'Indonésie', code: '+62', flag: '🇮🇩' },
  { name: 'Irak', code: '+964', flag: '🇮🇶' },
  { name: 'Iran', code: '+98', flag: '🇮🇷' },
  { name: 'Irlande', code: '+353', flag: '🇮🇪' },
  { name: 'Islande', code: '+354', flag: '🇮🇸' },
  { name: 'Israël', code: '+972', flag: '🇮🇱' },
  { name: 'Italie', code: '+39', flag: '🇮🇹' },
  { name: 'Jamaïque', code: '+1-876', flag: '🇯🇲' },
  { name: 'Japon', code: '+81', flag: '🇯🇵' },
  { name: 'Jordanie', code: '+962', flag: '🇯🇴' },
  { name: 'Kazakhstan', code: '+7', flag: '🇰🇿' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { name: 'Kirghizistan', code: '+996', flag: '🇰🇬' },
  { name: 'Kiribati', code: '+686', flag: '🇰🇮' },
  { name: 'Koweït', code: '+965', flag: '🇰🇼' },
  { name: 'Laos', code: '+856', flag: '🇱🇦' },
  { name: 'Lesotho', code: '+266', flag: '🇱🇸' },
  { name: 'Lettonie', code: '+371', flag: '🇱🇻' },
  { name: 'Liban', code: '+961', flag: '🇱🇧' },
  { name: 'Libéria', code: '+231', flag: '🇱🇷' },
  { name: 'Libye', code: '+218', flag: '🇱🇾' },
  { name: 'Liechtenstein', code: '+423', flag: '🇱🇮' },
  { name: 'Lituanie', code: '+370', flag: '🇱🇹' },
  { name: 'Luxembourg', code: '+352', flag: '🇱🇺' },
  { name: 'Macédoine du Nord', code: '+389', flag: '🇲🇰' },
  { name: 'Madagascar', code: '+261', flag: '🇲🇬' },
  { name: 'Malaisie', code: '+60', flag: '🇲🇾' },
  { name: 'Malawi', code: '+265', flag: '🇲🇼' },
  { name: 'Maldives', code: '+960', flag: '🇲🇻' },
  { name: 'Mali', code: '+223', flag: '🇲🇱' },
  { name: 'Malte', code: '+356', flag: '🇲🇹' },
  { name: 'Maroc', code: '+212', flag: '🇲🇦' },
  { name: 'Marshall', code: '+692', flag: '🇲🇭' },
  { name: 'Maurice', code: '+230', flag: '🇲🇺' },
  { name: 'Mauritanie', code: '+222', flag: '🇲🇷' },
  { name: 'Mexique', code: '+52', flag: '🇲🇽' },
  { name: 'Micronésie', code: '+691', flag: '🇫🇲' },
  { name: 'Moldavie', code: '+373', flag: '🇲🇩' },
  { name: 'Monaco', code: '+377', flag: '🇲🇨' },
  { name: 'Mongolie', code: '+976', flag: '🇲🇳' },
  { name: 'Monténégro', code: '+382', flag: '🇲🇪' },
  { name: 'Mozambique', code: '+258', flag: '🇲🇿' },
  { name: 'Namibie', code: '+264', flag: '🇳🇦' },
  { name: 'Nauru', code: '+674', flag: '🇳🇷' },
  { name: 'Népal', code: '+977', flag: '🇳🇵' },
  { name: 'Nicaragua', code: '+505', flag: '🇳🇮' },
  { name: 'Niger', code: '+227', flag: '🇳🇪' },
  { name: 'Nigéria', code: '+234', flag: '🇳🇬' },
  { name: 'Norvège', code: '+47', flag: '🇳🇴' },
  { name: 'Nouvelle-Zélande', code: '+64', flag: '🇳🇿' },
  { name: 'Oman', code: '+968', flag: '🇴🇲' },
  { name: 'Ouganda', code: '+256', flag: '🇺🇬' },
  { name: 'Ouzbékistan', code: '+998', flag: '🇺🇿' },
  { name: 'Pakistan', code: '+92', flag: '🇵🇰' },
  { name: 'Palaos', code: '+680', flag: '🇵🇼' },
  { name: 'Palestine', code: '+970', flag: '🇵🇸' },
  { name: 'Panama', code: '+507', flag: '🇵🇦' },
  { name: 'Papouasie-Nouvelle-Guinée', code: '+675', flag: '🇵🇬' },
  { name: 'Paraguay', code: '+595', flag: '🇵🇾' },
  { name: 'Pays-Bas', code: '+31', flag: '🇳🇱' },
  { name: 'Pérou', code: '+51', flag: '🇵🇪' },
  { name: 'Philippines', code: '+63', flag: '🇵🇭' },
  { name: 'Pologne', code: '+48', flag: '🇵🇱' },
  { name: 'Portugal', code: '+351', flag: '🇵🇹' },
  { name: 'Qatar', code: '+974', flag: '🇶🇦' },
  { name: 'République Centrafricaine', code: '+236', flag: '🇨🇫' },
  { name: 'République Dominicaine', code: '+1-809', flag: '🇩🇴' },
  { name: 'République Tchèque', code: '+420', flag: '🇨🇿' },
  { name: 'Roumanie', code: '+40', flag: '🇷🇴' },
  { name: 'Royaume-Uni', code: '+44', flag: '🇬🇧' },
  { name: 'Russie', code: '+7', flag: '🇷🇺' },
  { name: 'Rwanda', code: '+250', flag: '🇷🇼' },
  { name: 'Saint-Christophe-et-Niévès', code: '+1-869', flag: '🇰🇳' },
  { name: 'Sainte-Lucie', code: '+1-758', flag: '🇱🇨' },
  { name: 'Saint-Marin', code: '+378', flag: '🇸🇲' },
  { name: 'Saint-Vincent-et-les-Grenadines', code: '+1-784', flag: '🇻🇨' },
  { name: 'Salomon', code: '+677', flag: '🇸🇧' },
  { name: 'Salvador', code: '+503', flag: '🇸🇻' },
  { name: 'Samoa', code: '+685', flag: '🇲🇸' },
  { name: 'Sao Tomé-et-Principe', code: '+239', flag: '🇸🇹' },
  { name: 'Sénégal', code: '+221', flag: '🇸🇳' },
  { name: 'Serbie', code: '+381', flag: '🇷🇸' },
  { name: 'Seychelles', code: '+248', flag: '🇸🇨' },
  { name: 'Sierra Leone', code: '+232', flag: '🇸🇱' },
  { name: 'Singapour', code: '+65', flag: '🇸🇬' },
  { name: 'Slovaquie', code: '+421', flag: '🇸🇰' },
  { name: 'Slovénie', code: '+386', flag: '🇸🇮' },
  { name: 'Somalie', code: '+252', flag: '🇸🇴' },
  { name: 'Soudan', code: '+249', flag: '🇸🇩' },
  { name: 'Soudan du Sud', code: '+211', flag: '🇸🇸' },
  { name: 'Sri Lanka', code: '+94', flag: '🇱🇰' },
  { name: 'Suède', code: '+46', flag: '🇸🇪' },
  { name: 'Suisse', code: '+41', flag: '🇨🇭' },
  { name: 'Suriname', code: '+597', flag: '🇸🇷' },
  { name: 'Syrie', code: '+963', flag: '🇸🇾' },
  { name: 'Tadjikistan', code: '+992', flag: '🇹🇯' },
  { name: 'Taïwan', code: '+886', flag: '🇹🇼' },
  { name: 'Tanzanie', code: '+255', flag: '🇹🇿' },
  { name: 'Tchad', code: '+235', flag: '🇹🇩' },
  { name: 'Thaïlande', code: '+66', flag: '🇹🇭' },
  { name: 'Timor oriental', code: '+670', flag: '🇹🇱' },
  { name: 'Togo', code: '+228', flag: '🇹🇬' },
  { name: 'Tonga', code: '+676', flag: '🇹🇴' },
  { name: 'Trinité-et-Tobago', code: '+1-868', flag: '🇹🇹' },
  { name: 'Tunisie', code: '+216', flag: '🇹🇳' },
  { name: 'Turkménistan', code: '+993', flag: '🇹🇲' },
  { name: 'Turquie', code: '+90', flag: '🇹🇷' },
  { name: 'Tuvalu', code: '+688', flag: '🇹🇻' },
  { name: 'Ukraine', code: '+380', flag: '🇺🇦' },
  { name: 'Uruguay', code: '+598', flag: '🇺🇾' },
  { name: 'Vanuatu', code: '+678', flag: '🇻🇺' },
  { name: 'Vatican', code: '+379', flag: '🇻🇦' },
  { name: 'Venezuela', code: '+58', flag: '🇻🇪' },
  { name: 'Viêt Nam', code: '+84', flag: '🇻🇳' },
  { name: 'Yémen', code: '+967', flag: '🇾🇪' },
  { name: 'Zambie', code: '+260', flag: '🇿🇲' },
  { name: 'Zimbabwe', code: '+263', flag: '🇿🇼' }
].sort((a, b) => a.name.localeCompare(b.name));

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminOnly?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, adminOnly = false }) => {
  useBackButton(onClose, isOpen);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [emailFieldError, setEmailFieldError] = useState('');
  const [phoneFieldError, setPhoneFieldError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSelectingCountry, setIsSelectingCountry] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralValidated, setReferralValidated] = useState<{ valid: boolean; sponsorName?: string; checking?: boolean } | null>(null);
  const [showWelcomeCelebration, setShowWelcomeCelebration] = useState(false);
  const [welcomeCelebrationData, setWelcomeCelebrationData] = useState<{ referrerName?: string; hoursAwarded?: number } | null>(null);

  // Login History & Saved Accounts State
  const [savedAccounts, setSavedAccounts] = useState<SavedLoginAccount[]>([]);
  const [selectedAccountEmail, setSelectedAccountEmail] = useState<string>('');
  const [showAllSavedAccounts, setShowAllSavedAccounts] = useState(false);

  const backdropRef = React.useRef<HTMLDivElement>(null);
  const modalContentRef = React.useRef<HTMLDivElement>(null);

  const filteredCountries = countriesData.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.includes(countrySearch)
  );

  React.useEffect(() => {
    if (isOpen) {
      setIsForgotPassword(false);
      setResetEmailSent(false);
      const urlParams = new URLSearchParams(window.location.search);
      const urlRef = urlParams.get('ref') || urlParams.get('invite') || urlParams.get('sponsor');
      if (urlRef) {
        setReferralCode(urlRef.toUpperCase());
        setIsLogin(false);
      }
      
      const accounts = getSavedLoginAccounts();
      setSavedAccounts(accounts);

      if (accounts.length > 0) {
        const latest = accounts[0];
        setEmail(latest.email);
        setSelectedAccountEmail(latest.email.toLowerCase());
        if (latest.password) {
          setPassword(latest.password);
        } else {
          setPassword('');
        }
      } else {
        const savedEmail = localStorage.getItem('asrarhub_saved_email');
        const savedPassword = localStorage.getItem('asrarhub_saved_password');
        if (savedEmail) {
          setEmail(savedEmail);
          setSelectedAccountEmail(savedEmail.toLowerCase());
        } else {
          setEmail('');
          setSelectedAccountEmail('');
        }
        if (savedPassword) {
          setPassword(savedPassword);
        } else {
          setPassword('');
        }
      }
    }
  }, [isOpen]);

  const handleSelectSavedAccount = (acc: SavedLoginAccount) => {
    setEmail(acc.email);
    setPassword(acc.password || '');
    setSelectedAccountEmail(acc.email.toLowerCase());
    setError('');
    setEmailFieldError('');
  };

  const handleRemoveSavedAccount = (e: React.MouseEvent, accEmail: string) => {
    e.stopPropagation();
    const updated = removeSavedLoginAccount(accEmail);
    setSavedAccounts(updated);
    if (selectedAccountEmail.toLowerCase() === accEmail.toLowerCase() || email.toLowerCase() === accEmail.toLowerCase()) {
      if (updated.length > 0) {
        handleSelectSavedAccount(updated[0]);
      } else {
        setEmail('');
        setPassword('');
        setSelectedAccountEmail('');
      }
    }
  };

  const handleManualAccountEntry = () => {
    setEmail('');
    setPassword('');
    setSelectedAccountEmail('');
    setError('');
  };

  // Real-time debounced check of referral code
  React.useEffect(() => {
    if (!referralCode || referralCode.trim().length < 3) {
      setReferralValidated(null);
      return;
    }

    setReferralValidated({ valid: false, checking: true });
    const timer = setTimeout(async () => {
      const sponsor = await findUserByReferralCode(referralCode.trim());
      if (sponsor) {
        setReferralValidated({ valid: true, sponsorName: sponsor.name || 'Parrain AsrarHub', checking: false });
      } else {
        setReferralValidated({ valid: false, checking: false });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [referralCode]);

  // Lock background scroll and disable pull-to-refresh when authentication is open
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflowBody = document.body.style.overflow;
      const originalOverscrollBody = document.body.style.overscrollBehavior;
      const originalOverflowHtml = document.documentElement.style.overflow;
      const originalOverscrollHtml = document.documentElement.style.overscrollBehavior;

      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';

      return () => {
        document.body.style.overflow = originalOverflowBody;
        document.body.style.overscrollBehavior = originalOverscrollBody;
        document.documentElement.style.overflow = originalOverflowHtml;
        document.documentElement.style.overscrollBehavior = originalOverscrollHtml;
      };
    }
  }, [isOpen]);

  // Real-time verification when typing email or phone in registration mode
  React.useEffect(() => {
    if (isLogin) {
      setEmailFieldError('');
      setPhoneFieldError('');
      return;
    }

    // 1. Instant check for Gmail requirement, plus aliases, and disposable email
    if (email && !isGmailAddress(email)) {
      setEmailFieldError(t('auth.gmailOnlyError', 'Seules les adresses Gmail (@gmail.com) sont autorisées pour la création de compte.'));
    } else if (email && (hasGmailPlusAlias(email) || hasEmailAlias(email))) {
      setEmailFieldError(t('auth.gmailAliasError', 'Les extensions et alias Gmail (ex: avec le symbole "+") ne sont pas autorisés.'));
    } else if (email && isDisposableEmail(email)) {
      setEmailFieldError(t('auth.disposableEmailError', 'Les adresses email temporaires ou jetables (temp mail) ne sont pas autorisées.'));
    }

    // 2. Debounced check against existing phone and email aliases in DB and local sessions
    const timer = setTimeout(async () => {
      let currentEmailErr = '';
      let currentPhoneErr = '';

      if (email && !isGmailAddress(email)) {
        currentEmailErr = t('auth.gmailOnlyError', 'Seules les adresses Gmail (@gmail.com) sont autorisées pour la création de compte.');
      } else if (email && (hasGmailPlusAlias(email) || hasEmailAlias(email))) {
        currentEmailErr = t('auth.gmailAliasError', 'Les extensions et alias Gmail (ex: avec le symbole "+") ne sont pas autorisés.');
      } else if (email && isDisposableEmail(email)) {
        currentEmailErr = t('auth.disposableEmailError', 'Les adresses email temporaires ou jetables (temp mail) ne sont pas autorisées.');
      }

      if ((email && !currentEmailErr) || phone) {
        const val = await validateRegistrationDetails(email || '', phone || '', db);
        if (!val.valid && val.error) {
          if (val.error.includes('email') || val.error.includes('mail') || val.error.includes('alias')) {
            currentEmailErr = val.error;
          }
          if (val.error.includes('téléphone') || val.error.includes('numéro') || val.error.includes('Phone')) {
            currentPhoneErr = val.error;
          }
        }
      }

      setEmailFieldError(currentEmailErr);
      setPhoneFieldError(currentPhoneErr);
    }, 450);

    return () => clearTimeout(timer);
  }, [email, phone, isLogin, t]);

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

  const handleResendEmail = async () => {
    setResendLoading(true);
    setResendStatus('');
    try {
      if (auth.currentUser) {
        await sendVerificationEmail(auth.currentUser);
        setResendStatus(t('auth.resendSuccess', "Un nouvel email de vérification a été envoyé ! N'oubliez surtout pas de vérifier votre dossier SPAM / Courriers indésirables."));
      } else {
        setResendStatus(t('auth.resendCheckSpam', "Un email vous a été envoyé lors de la création de compte. Vérifiez votre boîte mail ainsi que vos SPAMS."));
      }
    } catch (err: any) {
      console.warn("Resend verification error:", err);
      setResendStatus(t('auth.resendError', "Impossible de renvoyer l'email pour le moment. Pensez à vérifier vos SPAMS ou réessayez plus tard."));
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResendStatus('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signInWithEmail(email, password);
        if (result?.user) {
          // Existing users logging in do not require account validation
          try {
            const userRef = doc(db, 'users', result.user.uid);
            await updateDoc(userRef, { requiresValidation: false, emailVerified: true }).catch(() => {});
          } catch (e) {}
        }
      } else {
        // Pre-validate registration details before attempting auth creation
        const validation = await validateRegistrationDetails(email, phone, db);
        if (!validation.valid) {
          const errMsg = validation.error || "Informations d'inscription invalides.";
          setError(errMsg);
          if (errMsg.includes('email') || errMsg.includes('mail') || errMsg.includes('alias')) {
            setEmailFieldError(errMsg);
          }
          if (errMsg.includes('téléphone') || errMsg.includes('numéro') || errMsg.includes('Phone')) {
            setPhoneFieldError(errMsg);
          }
          setLoading(false);
          return;
        }

        result = await signUpWithEmail(email, password, name, country, phone, referralCode.trim() || undefined);
        if (result?.user) {
          // Process referral reward if referral code is provided
          if (referralCode && referralCode.trim()) {
            try {
              const refRes = await processReferralRegistration({
                newUserId: result.user.uid,
                newUserName: name,
                newUserEmail: email,
                referralCode: referralCode.trim()
              });
              if (refRes.success) {
                setWelcomeCelebrationData({
                  referrerName: refRes.referrerName,
                  hoursAwarded: refRes.refereeRewardHours
                });
                setShowWelcomeCelebration(true);
              }
            } catch (refErr) {
              console.warn("Referral processing note:", refErr);
            }
          }
          // sendVerificationEmail is already dispatched instantly inside signUpWithEmail
          setVerificationSent(true);
          setLoading(false);
          return;
        }
      }

      if (result?.user) {
        let isUserAdmin = false;
        const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];

        try {
          const userRef = doc(db, 'users', result.user.uid);
          const docSnap = await getDoc(userRef).catch(() => null);
          
          if (docSnap?.exists() && docSnap.data().role === 'admin') {
            isUserAdmin = true;
          } else if (result.user.email && adminEmails.includes(result.user.email.toLowerCase())) {
            if (docSnap?.exists()) {
               await updateDoc(userRef, { role: 'admin' }).catch(() => {});
            } else {
               await setDoc(userRef, { email: result.user.email, role: 'admin', createdAt: new Date() }).catch(() => {});
            }
            isUserAdmin = true;
          }
        } catch (dbErr) {
          console.warn("Firestore user record fetch failed:", dbErr);
          if (result.user.email && adminEmails.includes(result.user.email.toLowerCase())) {
            isUserAdmin = true;
          }
        }

        // Save account into login history
        saveLoginAccount({
          email: email.trim(),
          password: rememberMe ? password : undefined,
          name: name || result.user.displayName || email.split('@')[0],
          role: isUserAdmin ? 'admin' : undefined,
          photoURL: result.user.photoURL || undefined,
          savePassword: rememberMe
        });
        
        if (adminOnly) {
          if (isUserAdmin) {
            onClose();
            navigate('/admin');
          } else {
            await signOut().catch(() => {});
            setError(t('auth.accessDenied', "Accès refusé. Vous n'êtes pas administrateur."));
            setLoading(false);
          }
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const errCode = err.code || '';
      const errMessage = err.message || '';

      if (errCode === 'auth/wrong-password' || errCode === 'auth/user-not-found' || errCode === 'auth/invalid-credential') {
        setError(t('auth.invalidCredentials', 'Email ou mot de passe incorrect.'));
      } else if (errCode === 'auth/email-already-in-use' || errMessage.includes('email-already-in-use')) {
        const msg = t('auth.emailInUse', 'Cette adresse email est déjà utilisée par un autre compte. Veuillez vous connecter.');
        setError(msg);
        setEmailFieldError(msg);
      } else if (errCode === 'auth/invalid-email') {
        const msg = t('auth.invalidEmail', 'Adresse email invalide.');
        setError(msg);
        setEmailFieldError(msg);
      } else if (errCode === 'auth/weak-password') {
        setError(t('auth.weakPassword', 'Le mot de passe doit contenir au moins 6 caractères.'));
      } else if (errCode === 'auth/too-many-requests') {
        setError(t('auth.tooManyRequests', 'Trop de tentatives d\'accès. Veuillez patienter un moment avant de reessayer.'));
      } else if (errCode === 'auth/network-request-failed' || errMessage.includes('network')) {
        setError(t('auth.networkError', "La connexion aux serveurs d'authentification a échoué. Vérifiez votre connexion internet ou réessayez dans un nouvel onglet."));
      } else {
        setError(errMessage || t('auth.errorOccurred', 'Une erreur est survenue.'));
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
        let isUserAdmin = false;
        const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];

        try {
          const userRef = doc(db, 'users', result.user.uid);
          const docSnap = await getDoc(userRef).catch(() => null);
          
          if (docSnap?.exists() && docSnap.data().role === 'admin') {
            isUserAdmin = true;
          } else if (result.user.email && adminEmails.includes(result.user.email.toLowerCase())) {
            if (docSnap?.exists()) {
               await updateDoc(userRef, { role: 'admin' }).catch(() => {});
            } else {
               await setDoc(userRef, { email: result.user.email, role: 'admin', createdAt: new Date() }).catch(() => {});
            }
            isUserAdmin = true;
          } else if (!docSnap?.exists()) {
            await setDoc(userRef, { email: result.user.email, name: result.user.displayName, role: 'user', createdAt: new Date() }).catch(() => {});
          }
        } catch (dbErr) {
          console.warn("Google sign in firestore sync warning:", dbErr);
          if (result.user.email && adminEmails.includes(result.user.email.toLowerCase())) {
            isUserAdmin = true;
          }
        }

        // Save account into login history
        if (result.user.email) {
          saveLoginAccount({
            email: result.user.email,
            name: result.user.displayName || result.user.email.split('@')[0],
            role: isUserAdmin ? 'admin' : undefined,
            photoURL: result.user.photoURL || undefined,
            savePassword: false
          });
        }
        
        if (adminOnly) {
          if (isUserAdmin) {
            onClose();
            navigate('/admin');
          } else {
            await signOut().catch(() => {});
            setError(t('auth.accessDenied', "Accès refusé. Vous n'êtes pas administrateur."));
            setLoading(false);
          }
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      console.error("Google sign in error:", err);
      if (err.code === 'auth/network-request-failed' || err.message?.includes('network')) {
        setError(t('auth.networkError', "La connexion aux serveurs d'authentification a échoué. Vérifiez votre connexion internet ou réessayez dans un nouvel onglet."));
      } else {
        setError(t('auth.googleError', 'Erreur lors de la connexion avec Google.'));
      }
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div ref={backdropRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm overflow-hidden">
          <motion.div
            ref={modalContentRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-y-auto max-h-[calc(100dvh-2rem)] sm:max-h-[85vh] relative border border-gray-100 dark:border-gray-800 overscroll-contain"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <AnimatePresence>
              {isSelectingCountry && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-white dark:bg-gray-900 z-50 p-6 rounded-2xl flex flex-col h-full overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4 shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Globe className="text-emerald-500 animate-spin" style={{ animationDuration: '12s' }} size={18} />
                      {t('auth.selectCountry', 'Sélectionnez votre pays')}
                    </h3>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsSelectingCountry(false);
                        setCountrySearch('');
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  {/* Search bar inside country selector */}
                  <div className="relative mb-4 shrink-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Search size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder={t('auth.searchCountryPlaceholder', 'Rechercher un pays ou code...')}
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full px-4 py-2.5 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white text-sm"
                      autoFocus
                    />
                    {countrySearch && (
                      <button
                        type="button"
                        onClick={() => setCountrySearch('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Countries scrollable list */}
                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((c, cIdx) => (
                        <button
                          key={`auth-country-${c.code}-${c.name}-${cIdx}`}
                          type="button"
                          onClick={() => {
                            setCountry(c.name);
                            setPhone(c.code + ' ');
                            setIsSelectingCountry(false);
                            setCountrySearch('');
                          }}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-left transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl shrink-0" role="img" aria-label={c.name}>{c.flag}</span>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{c.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 group-hover:text-emerald-500">{c.code}</span>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        {t('auth.noCountryFound', 'Aucun pays trouvé')}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                        placeholder={t('auth.emailPlaceholder', 'votre@email.com')}
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
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                    <Mail size={32} />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    <Zap size={13} className="text-emerald-500 animate-pulse" />
                    <span>⚡ Email d'activation envoyé instantanément</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('auth.verifyEmailTitle', 'Vérification de votre email requise')}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
                    {t('auth.verifyEmailDesc', 'Un email de vérification avec un lien d\'activation instantané a été transmis à')} <span className="font-bold text-emerald-600 dark:text-emerald-400">{email || t('auth.yourEmailAddress', 'votre adresse email')}</span>. {t('auth.verifyEmailAction', 'Vous devez impérativement cliquer sur ce lien pour activer votre compte.')}
                  </p>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-2xl flex items-start gap-3 text-left text-xs text-amber-900 dark:text-amber-200 shadow-sm">
                    <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div className="space-y-1">
                      <p className="font-extrabold text-amber-800 dark:text-amber-300 text-sm uppercase tracking-wide">
                        ⚠️ {t('auth.spamWarningTitle', 'Pensez à vérifier vos SPAMS !')}
                      </p>
                      <p className="leading-relaxed">
                        {t('auth.spamWarningDesc', "Si l'email n'apparaît pas dans votre boîte de réception d'ici 1 à 2 minutes, vérifiez impérativement votre dossier de courriers indésirables (SPAM / Junk).")}
                      </p>
                    </div>
                  </div>

                  {resendStatus && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl font-medium">
                      {resendStatus}
                    </div>
                  )}

                  <div className="pt-2 space-y-2.5">
                    <button
                      type="button"
                      onClick={handleResendEmail}
                      disabled={resendLoading}
                      className="w-full py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Mail size={15} />
                      {resendLoading ? t('auth.sending', 'Envoi en cours...') : t('auth.resendVerificationEmail', "Renvoyer l'email de vérification (Vérifier SPAM)")}
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        setResendLoading(true);
                        setResendStatus('');
                        try {
                          if (auth.currentUser) {
                            await auth.currentUser.reload();
                            if (auth.currentUser.emailVerified) {
                              setVerificationSent(false);
                              onClose();
                              return;
                            }
                          }
                          setResendStatus("Email non encore vérifié. Veuillez cliquer sur le lien reçu dans votre boîte de réception.");
                        } catch (e) {
                          setVerificationSent(false);
                          setIsLogin(true);
                        } finally {
                          setResendLoading(false);
                        }
                      }}
                      disabled={resendLoading}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      {resendLoading ? "Vérification..." : t('auth.verifiedBackToLogin', "J'ai vérifié mon email / Activer mon compte")}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setVerificationSent(false);
                        setIsLogin(true);
                      }}
                      className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      Retour à la connexion
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm rounded-xl space-y-2">
                        <div className="flex items-start gap-2">
                          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                          <p className="flex-1 text-xs sm:text-sm leading-relaxed">{error}</p>
                        </div>
                        {(error.includes("serveurs") || error.includes("connexion") || error.includes("network")) && email && (
                          <div className="pt-2 border-t border-red-200/50 dark:border-red-800/40 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setLocalUserSession(email, name, country, phone, !isLogin);
                                onClose();
                              }}
                              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-all"
                            >
                              Continuer en session locale &rarr;
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Saved Accounts / Login History Quick Switcher */}
                    {isLogin && savedAccounts.length > 0 && (
                      <div className="mb-2 p-3 bg-gradient-to-br from-emerald-50/80 via-slate-50 to-emerald-50/50 dark:from-emerald-950/30 dark:via-gray-800/80 dark:to-emerald-950/20 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/50 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                            <History size={14} className="text-emerald-600 dark:text-emerald-400" />
                            <span>{t('auth.savedAccounts', 'Comptes mémorisés / Connexion rapide')}</span>
                          </span>
                          {savedAccounts.length > 2 && (
                            <button
                              type="button"
                              onClick={() => setShowAllSavedAccounts(!showAllSavedAccounts)}
                              className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                            >
                              {showAllSavedAccounts ? t('common.showLess', 'Voir moins') : `+${savedAccounts.length - 2} ${t('common.more', 'autres')}`}
                            </button>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          {(showAllSavedAccounts ? savedAccounts : savedAccounts.slice(0, 2)).map((acc, accIdx) => {
                            const isSelected = selectedAccountEmail.toLowerCase() === acc.email.toLowerCase() && email.toLowerCase() === acc.email.toLowerCase();
                            return (
                              <div
                                key={`saved-acc-${acc.id || acc.email}-${accIdx}`}
                                onClick={() => handleSelectSavedAccount(acc)}
                                className={`group flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-white dark:bg-gray-800 border-emerald-500 shadow-sm ring-2 ring-emerald-500/25'
                                    : 'bg-white/80 dark:bg-gray-800/60 border-gray-200/80 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-emerald-300'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                                      acc.avatarColor || 'bg-emerald-600 text-white'
                                    }`}
                                  >
                                    {(acc.name || acc.email).charAt(0).toUpperCase()}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                        {acc.name || acc.email.split('@')[0]}
                                      </p>
                                      {acc.role === 'admin' && (
                                        <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded">
                                          Admin
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                      {acc.email}
                                    </p>
                                  </div>

                                  {acc.password ? (
                                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 flex items-center gap-1">
                                      <KeyRound size={11} className="text-emerald-600" />
                                      <span className="hidden sm:inline">{t('auth.autoFilled', '1-clic')}</span>
                                    </span>
                                  ) : (
                                    <span className="shrink-0 text-[10px] text-gray-400">
                                      {t('auth.emailOnly', 'Email seul')}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1 ml-2 shrink-0">
                                  {isSelected && (
                                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                                      <Check size={12} />
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => handleRemoveSavedAccount(e, acc.email)}
                                    title={t('auth.removeSavedAccount', 'Oublier ce compte')}
                                    className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-1.5 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-[11px]">
                          <button
                            type="button"
                            onClick={handleManualAccountEntry}
                            className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                              !selectedAccountEmail || (email === '' && password === '')
                                ? 'text-emerald-600 dark:text-emerald-400 underline'
                                : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                            }`}
                          >
                            <Plus size={13} />
                            <span>{t('auth.useAnotherAccount', 'Entrer un autre compte')}</span>
                          </button>

                          {savedAccounts.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                clearAllSavedLoginAccounts();
                                setSavedAccounts([]);
                                handleManualAccountEntry();
                              }}
                              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                            >
                              {t('auth.clearHistory', 'Effacer historique')}
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {!isLogin && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('auth.fullName', 'Nom complet')} <span className="text-red-500 font-bold">*</span>
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

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('auth.country', 'Pays')} <span className="text-red-500 font-bold">*</span>
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setIsSelectingCountry(true)}
                              className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-emerald-500 transition-colors z-10"
                              title={t('auth.selectCountry', 'Sélectionnez votre pays')}
                            >
                              <Globe size={18} className="cursor-pointer" />
                            </button>
                            <input
                              type="text"
                              value={country}
                              onClick={() => setIsSelectingCountry(true)}
                              readOnly
                              required
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
                              placeholder={t('auth.countryPlaceholder', "Sélectionnez votre pays")}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t('auth.phone', 'Numéro de téléphone')} <span className="text-red-500 font-bold">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                              <Phone size={18} className={phoneFieldError ? 'text-red-500' : ''} />
                            </div>
                            <input
                              type="text"
                              value={phone}
                              onChange={(e) => {
                                setPhone(e.target.value);
                                if (phoneFieldError) setPhoneFieldError('');
                              }}
                              required
                              className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border ${
                                phoneFieldError
                                  ? 'border-red-500 ring-2 ring-red-500/30 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20'
                                  : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white'
                              } rounded-xl focus:border-transparent outline-none transition-all`}
                              placeholder={t('auth.phonePlaceholder', 'Ex: +221 77 123 45 67')}
                            />
                          </div>
                          {phoneFieldError && (
                            <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 flex items-start gap-1 font-medium leading-tight">
                              <AlertCircle size={14} className="shrink-0 mt-0.5" />
                              <span>{phoneFieldError}</span>
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('auth.email', 'Email')} <span className="text-red-500 font-bold">*</span>
                        {!isLogin && (
                          <span className="ml-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            (Gmail uniquement)
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Mail size={18} className={emailFieldError ? 'text-red-500' : ''} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEmail(val);
                            setSelectedAccountEmail(val.toLowerCase());
                            if (emailFieldError) setEmailFieldError('');
                            
                            // Check if typed email matches a saved account and autofill password
                            const match = savedAccounts.find(a => a.email.toLowerCase() === val.trim().toLowerCase());
                            if (match?.password) {
                              setPassword(match.password);
                            }
                          }}
                          required
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border ${
                            emailFieldError
                              ? 'border-red-500 ring-2 ring-red-500/30 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20'
                              : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white'
                          } rounded-xl focus:border-transparent outline-none transition-all`}
                          placeholder={!isLogin ? 'exemple@gmail.com' : t('auth.emailPlaceholder', 'votre@email.com')}
                        />
                      </div>
                      {/* Saved Accounts quick chips */}
                      {isLogin && savedAccounts.length > 0 && !savedAccounts.some(a => a.email.toLowerCase() === email.toLowerCase()) && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <History size={12} /> Suggestions :
                          </span>
                          {savedAccounts.slice(0, 3).map((acc, aIdx) => (
                            <button
                              key={`quick-chip-${acc.email}-${aIdx}`}
                              type="button"
                              onClick={() => handleSelectSavedAccount(acc)}
                              className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 font-medium transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>{acc.name || acc.email.split('@')[0]}</span>
                              {acc.password && <KeyRound size={10} className="text-emerald-600 dark:text-emerald-400" />}
                            </button>
                          ))}
                        </div>
                      )}
                      {!isLogin && !emailFieldError && (
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                          {t('auth.gmailHint', 'Seules les adresses @gmail.com sont acceptées pour créer un compte.')}
                        </p>
                      )}
                      {emailFieldError && (
                        <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 flex items-start gap-1 font-medium leading-tight">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <span>{emailFieldError}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('auth.password', 'Mot de passe')} <span className="text-red-500 font-bold">*</span>
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

                    {!isLogin && (
                      <div className="pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {t('auth.referralCode', 'Code de parrainage')} <span className="text-gray-400 font-normal text-[11px]">({t('common.optional', 'Optionnel')})</span>
                          </label>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-600 dark:text-amber-300 border border-amber-400/30 flex items-center gap-1">
                            <Sparkles size={11} className="text-amber-500" />
                            <span>Bonus VIP</span>
                          </span>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Gift size={18} className={referralValidated?.valid ? 'text-emerald-500' : ''} />
                          </div>
                          <input
                            type="text"
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                            className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border ${
                              referralValidated?.valid
                                ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold'
                                : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white'
                            } rounded-xl font-mono uppercase focus:border-transparent outline-none transition-all placeholder:normal-case placeholder:font-sans`}
                            placeholder="Ex: ASRAR-7789AB"
                          />
                          {referralValidated?.checking ? (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : referralValidated?.valid ? (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-500" title="Code validé">
                              <CheckCircle2 size={18} />
                            </div>
                          ) : null}
                        </div>
                        {referralValidated?.valid && referralValidated.sponsorName && (
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1 font-medium bg-emerald-50 dark:bg-emerald-950/30 p-1.5 rounded-lg border border-emerald-500/20">
                            <CheckCircle2 size={13} className="shrink-0" />
                            <span>Parrain validé : <strong>{referralValidated.sponsorName}</strong> (+Premium offert !)</span>
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <label className="flex items-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-700 text-emerald-600 focus:ring-emerald-500 mr-2 h-4 w-4 bg-gray-50 dark:bg-gray-800"
                        />
                        <span className="text-xs sm:text-sm font-medium">
                          {t('auth.rememberMeAndPass', 'Se souvenir de moi & du mot de passe')}
                        </span>
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
                            className="ml-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
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
      <ReferralWelcomeModal
        isOpen={showWelcomeCelebration}
        onClose={() => {
          setShowWelcomeCelebration(false);
          onClose();
        }}
        referrerName={welcomeCelebrationData?.referrerName}
        hoursAwarded={welcomeCelebrationData?.hoursAwarded}
      />
    </AnimatePresence>,
    document.body
  );
};
