import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Lock, 
  CreditCard, 
  Smartphone, 
  BookOpen, 
  HardDrive, 
  FileText, 
  Zap, 
  AlertCircle,
  Coins,
  BadgeCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { PdfDocument } from '../../types/pdfDocument';
import { formatPdfPrice, recordVerifiedPdfPurchase } from '../../utils/pdfSecurity';
import { PaystackService } from '../../services/PaystackService';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useFeatures } from '../../contexts/FeatureContext';
import { shouldEnablePaystack, isPlayStoreNoticeApplicable } from '../../utils/platformHelper';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PdfBookCover3D } from './PdfBookCover3D';

interface PdfPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdf: PdfDocument | null;
  onSuccess: (pdf: PdfDocument) => void;
}

export const PdfPurchaseModal: React.FC<PdfPurchaseModalProps> = ({
  isOpen,
  onClose,
  pdf,
  onSuccess,
}) => {
  const { user, isPremium } = useAuth();
  const { language } = useLanguage();
  const { featureToggles } = useFeatures();
  const navigate = useNavigate();

  const isPlayStoreMode = isPlayStoreNoticeApplicable(featureToggles);
  const isPaystackEnabled = shouldEnablePaystack(featureToggles) && featureToggles?.pdf_paystack_enabled !== false;
  const isPointsEnabled = featureToggles?.pdf_points_enabled !== false;

  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !pdf) return null;

  const price = pdf.price || 0;
  const currency = pdf.currency || 'FCFA';
  const originalPrice = pdf.originalPrice;
  const formattedPrice = formatPdfPrice(price, currency);

  // VIP discount calculation if applicable
  const hasVipDiscount = isPremium && pdf.vipDiscountPercent && pdf.vipDiscountPercent > 0;
  const finalPrice = hasVipDiscount ? Math.round(price * (1 - (pdf.vipDiscountPercent || 0) / 100)) : price;
  const formattedFinalPrice = formatPdfPrice(finalPrice, currency);

  // Points conversion: 1 point = 10 FCFA (approx)
  const userPoints = user?.spiritualPoints || 0;
  const requiredPoints = Math.round(finalPrice / 10);
  const canPayWithPoints = userPoints >= requiredPoints && requiredPoints > 0;

  const handlePayWithPaystack = async () => {
    if (!user) {
      alert(language === 'fr' ? 'Veuillez vous connecter pour acheter et lier ce livre à votre compte.' : 'Please log in to purchase.');
      onClose();
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const userEmail = user.email || `${user.uid}@asrarhub.app`;

    try {
      await PaystackService.initializePaystackPayment(
        userEmail,
        finalPrice,
        currency === 'FCFA' ? 'XOF' : currency,
        user.uid,
        async (reference) => {
          // Record purchase with verification
          const result = await recordVerifiedPdfPurchase(
            user.uid,
            userEmail,
            pdf,
            reference,
            'paystack'
          );

          if (result.success) {
            setPurchaseSuccess(true);
            setIsProcessing(false);
            setTimeout(() => {
              onSuccess(pdf);
            }, 1200);
          } else {
            setErrorMessage(result.error || 'Erreur lors de la validation');
            setIsProcessing(false);
          }
        },
        () => {
          setIsProcessing(false);
        }
      );
    } catch (e: any) {
      console.error('Paystack init error:', e);
      setErrorMessage(e?.message || 'Erreur d\'initialisation du paiement');
      setIsProcessing(false);
    }
  };

  const handlePayWithPoints = async () => {
    if (!user) return;
    if (!canPayWithPoints) {
      alert(`Points insuffisants. Vous avez ${userPoints} pts, il en faut ${requiredPoints} pts.`);
      return;
    }

    if (!window.confirm(`Confirmer l'achat de "${pdf.title}" avec ${requiredPoints} Points Spirituels ?`)) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Deduct points from user doc
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        spiritualPoints: increment(-requiredPoints),
      });

      // Record purchase
      const ref = `POINTS_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const result = await recordVerifiedPdfPurchase(
        user.uid,
        user.email || `${user.uid}@asrarhub.app`,
        pdf,
        ref,
        'spiritual_points'
      );

      if (result.success) {
        setPurchaseSuccess(true);
        setIsProcessing(false);
        setTimeout(() => {
          onSuccess(pdf);
        }, 1200);
      } else {
        setErrorMessage(result.error || 'Erreur validation');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Points payment error:', err);
      setErrorMessage(err?.message || 'Erreur lors du débit des points');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden my-auto"
      >
        {/* Top Header / Book Banner */}
        <div className="relative bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white p-5 sm:p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-4">
            {/* Book Cover Thumbnail */}
            <div className="shrink-0 flex items-center justify-center pt-1">
              <PdfBookCover3D size="sm" pdf={pdf} language={language} showShadow={true} />
            </div>

            {/* Book Title & Badges */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {pdf.category.toUpperCase()}
                </span>
                {pdf.isPremium && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                    <Sparkles size={9} /> VIP
                  </span>
                )}
              </div>

              <h3 className="font-black text-sm sm:text-base text-white line-clamp-2 leading-snug">
                {pdf.title}
              </h3>

              <p className="text-xs text-slate-300 line-clamp-1 mt-1">
                {pdf.author || 'Tradition AsrarHub'} • {pdf.pagesCount || 1} pages
              </p>

              {/* Price Tag with discount */}
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-emerald-400">
                  {formattedFinalPrice}
                </span>
                {originalPrice && originalPrice > finalPrice && (
                  <span className="text-xs line-through text-slate-400">
                    {formatPdfPrice(originalPrice, currency)}
                  </span>
                )}
                {hasVipDiscount && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                    Avantage VIP -{pdf.vipDiscountPercent}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Purchase Success State */}
          {purchaseSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-6 text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <Check size={36} className="animate-bounce" />
              </div>
              <h4 className="text-lg font-black text-gray-900 dark:text-white">
                Félicitations ! Livre déverrouillé avec succès
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Ce manuscrit est désormais associé à votre compte de façon définitive. Ouverture du lecteur en cours...
              </p>
            </motion.div>
          ) : (
            <>
              {/* Features Included List */}
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 space-y-2.5">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <BadgeCheck size={15} className="text-emerald-500" />
                  <span>Ce que vous obtenez avec cet achat :</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Check size={13} className="text-emerald-500 shrink-0" />
                    <span>Accès illimité à vie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={13} className="text-emerald-500 shrink-0" />
                    <span>Lecture hors-ligne sauvegardée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={13} className="text-emerald-500 shrink-0" />
                    <span>Fichier haute résolution ({pdf.fileSize || 'HD'})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={13} className="text-emerald-500 shrink-0" />
                    <span>Certifié & vérifié par l'Ordre</span>
                  </div>
                </div>
              </div>

              {/* Error Message if any */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Payment Methods & Play Store Compliance */}
              <div className="space-y-3">
                {isPaystackEnabled ? (
                  <button
                    type="button"
                    onClick={handlePayWithPaystack}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2.5">
                      {isProcessing ? (
                        <RefreshCw size={18} className="animate-spin text-white" />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                          <CreditCard size={18} />
                        </div>
                      )}
                      <div className="text-left">
                        <span className="block leading-tight">Payer par Mobile Money / Carte</span>
                        <span className="text-[10px] text-emerald-100 font-normal">Wave, Orange Money, MoMo, Visa</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-sm">{formattedFinalPrice}</span>
                    </div>
                  </button>
                ) : isPlayStoreMode ? (
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                      <ShieldCheck size={15} className="text-amber-600 dark:text-amber-400" />
                      <span>Conformité Google Play Store</span>
                    </div>
                    <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                      Conformément aux règles de facturation de Google Play, les paiements directs par carte et Mobile Money sont indisponibles dans l'application Android Play Store. Vous pouvez débloquer cet ouvrage avec vos <strong>Points Spirituels</strong> ci-dessous.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
                    Le paiement direct par carte ou Mobile Money est temporairement désactivé pour les PDF.
                  </div>
                )}

                {/* Pay with Spiritual Points Option */}
                {isPointsEnabled && user && (
                  <button
                    type="button"
                    onClick={handlePayWithPoints}
                    disabled={isProcessing || !canPayWithPoints}
                    className={`w-full py-3 px-4 rounded-2xl border transition-all text-xs font-bold flex items-center justify-between cursor-pointer ${
                      canPayWithPoints
                        ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950/50'
                        : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
                        <Coins size={16} />
                      </div>
                      <div className="text-left">
                        <span className="block">Échanger avec Points Spirituels</span>
                        <span className="text-[10px] opacity-80">
                          Votre solde : {userPoints} pts (Requis : {requiredPoints} pts)
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-xs">{requiredPoints} pts</span>
                  </button>
                )}
              </div>

              {/* Anti-Hack & Security Seals */}
              <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  <span>Chiffrement 256-bit SSL</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Lock size={12} className="text-emerald-500" />
                  <span>Vérification Anti-Fraude</span>
                </span>
                <span>•</span>
                <span>Paystack Verified</span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
