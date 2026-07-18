import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFeatures } from '../../contexts/FeatureContext';
import { 
  Shield, Star, Check, Sparkles, ArrowLeft, CreditCard, Landmark, Bitcoin, Crown, 
  Copy, Upload, Clock, CheckCircle, XCircle, X, AlertCircle
} from 'lucide-react';
import { PaystackService } from '../../services/PaystackService';
import { Link, useNavigate } from 'react-router-dom';
import { AuthModal } from '../../components/AuthModal';
import { db } from '../../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';

export const PaymentPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { featureToggles } = useFeatures();
  const navigate = useNavigate();

  const price3m = Number(featureToggles?.premium_price_3m) || 150;
  const price6m = Number(featureToggles?.premium_price_6m) || 280;
  const price12m = Number(featureToggles?.premium_price_12m) || 520;
  const premiumCurrency = featureToggles?.premium_currency || 'GHS';

  const detectUserCurrencyAndPrice = (priceUSD: number) => {
    let price = price3m;
    if (priceUSD === 13) price = price3m;
    if (priceUSD === 25) price = price6m;
    if (priceUSD === 45) price = price12m;
    
    let originalPrice = price;
    if (appliedPromo && appliedPromo.type === 'discount') {
      if (appliedPromo.discountType === 'percent') {
        price = Math.round(price * (1 - (appliedPromo.discountValue || 0) / 100));
      } else {
        price = Math.max(0, price - (appliedPromo.discountValue || 0));
      }
    }

    const wasDiscounted = price < originalPrice;
    const displayStr = wasDiscounted 
      ? `${price} ${premiumCurrency} (au lieu de ${originalPrice} ${premiumCurrency})` 
      : `${price} ${premiumCurrency}`;

    return { 
      currency: premiumCurrency, 
      price: price, 
      originalPrice: originalPrice, 
      wasDiscounted: wasDiscounted, 
      displayStr: displayStr 
    };
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/user/dashboard');
    }
    setTimeout(() => {
      if (window.location.pathname === '/payment') {
        navigate('/user/dashboard');
      }
    }, 150);
  };

  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userLocationInfo, setUserLocationInfo] = useState({ currency: 'USD' });
  
  // Promo Code States
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);
  
  // Direct Payment / Modal State
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'direct' | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Direct transfer form state
  const [senderName, setSenderName] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [submittingDirect, setSubmittingDirect] = useState(false);
  const [messageDirect, setMessageDirect] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Users' manual payment history
  const [manualPayments, setManualPayments] = useState<any[]>([]);

  useEffect(() => {
    setUserLocationInfo({ currency: premiumCurrency });
  }, [premiumCurrency]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'manual_payments'),
      where('userId', '==', user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort client-side by createdAt descending
      list.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setManualPayments(list);
    }, (error) => {
      console.warn("PaymentPage manual_payments onSnapshot error (operating offline):", error);
    });
    return () => unsub();
  }, [user]);

  const plans = [
    {
      id: 'premium_3m',
      name: t('payment.plan3m', 'Premium (3 Mois)'),
      description: t('payment.desc3m', 'Accès complet aux outils.'),
      priceNumber: 13,
      features: [
        t('payment.featUnlimited', 'Outils spirituels illimités'),
        t('payment.featTutorials', 'Tutoriels Sirr Al Asrar avancés'),
        t('payment.featNoAds', 'Aucune publicité'),
        t('payment.featSupport', 'Support prioritaire')
      ],
      icon: Star,
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 'premium_6m',
      name: t('payment.plan6m', 'Premium (6 Mois)'),
      description: t('payment.desc6m', 'Consultation personnalisée et accès complet.'),
      priceNumber: 25,
      features: [
        t('payment.featAllPremium', 'Toutes les fonctionnalités Premium'),
        t('payment.featSave', 'Économie sur la durée'),
        t('payment.featTreatments', 'Traitements personnalisés'),
        t('payment.featExperts', 'Accès direct aux experts')
      ],
      icon: Shield,
      color: 'from-fuchsia-500 to-purple-600'
    },
    {
      id: 'premium_12m',
      name: t('payment.plan12m', 'Premium (12 Mois)'),
      description: t('payment.desc12m', 'Le choix ultime pour une année de spiritualité accompagnée.'),
      priceNumber: 45,
      features: [
        t('payment.featAllPremium', 'Toutes les fonctionnalités Premium'),
        t('payment.featMaxSave', 'Économie maximale sur la durée'),
        t('payment.featTreatments', 'Traitements personnalisés'),
        t('payment.featExperts', 'Accès direct aux experts')
      ],
      icon: Crown,
      color: 'from-emerald-400 to-teal-600'
    }
  ];

  const handleSubscribeClick = (plan: any) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedPlan(plan);
    setPaymentMethod(null);
    setMessageDirect(null);
    setSenderName('');
    setTransactionRef('');
    setReceiptBase64(null);
    setReceiptFileName('');
  };

  const incrementPromoUses = async (code: string) => {
    try {
      const { increment } = await import('firebase/firestore');
      await updateDoc(doc(db, 'promo_codes', code.toUpperCase()), {
        uses: increment(1)
      });
    } catch (err) {
      console.warn("Failed to increment promo uses:", err);
    }
  };

  const handleApplyPromoCode = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!promoCodeInput.trim()) return;

    setApplyingPromo(true);
    setPromoError(null);
    setPromoSuccess(null);

    try {
      const { getDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'promo_codes', promoCodeInput.trim().toUpperCase());
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setPromoError(t('payment.promoInvalid', "Code promo invalide ou inexistant."));
        setAppliedPromo(null);
        return;
      }

      const promo = docSnap.data();

      if (!promo.isActive) {
        setPromoError(t('payment.promoInactive', "Ce code promo n'est plus actif."));
        setAppliedPromo(null);
        return;
      }

      if (promo.expiryDate && Date.now() > promo.expiryDate) {
        setPromoError(t('payment.promoExpired', "Ce code promo a expiré."));
        setAppliedPromo(null);
        return;
      }

      if (promo.maxUses && (promo.uses || 0) >= promo.maxUses) {
        setPromoError(t('payment.promoLimit', "Ce code promo a atteint sa limite d'utilisations."));
        setAppliedPromo(null);
        return;
      }

      // Valid promo!
      setAppliedPromo({ code: docSnap.id, ...promo });
      
      let successMsg = "";
      if (promo.type === 'discount') {
        successMsg = promo.discountType === 'percent' 
          ? `Code promo appliqué ! Vous bénéficiez de -${promo.discountValue}% sur tous les abonnements.`
          : `Code promo appliqué ! Vous bénéficiez d'une réduction de -${promo.discountValue} ${premiumCurrency}.`;
      } else if (promo.type === 'unlock_subscription') {
        successMsg = `Code promo valide ! Vous pouvez débloquer directement un abonnement Premium de ${promo.subscriptionMonths} mois gratuitement.`;
      } else if (promo.type === 'unlock_product') {
        successMsg = `Code promo valide ! Vous pouvez débloquer gratuitement l'article correspondant de la boutique.`;
      }

      setPromoSuccess(successMsg);
    } catch (err) {
      console.error(err);
      setPromoError("Une erreur est survenue lors de la validation du code.");
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleActivateDirectPromo = async () => {
    if (!user || !appliedPromo) return;
    setLoading(true);

    try {
      const { doc, getDoc, updateDoc } = await import('firebase/firestore');

      if (appliedPromo.type === 'unlock_subscription') {
        const months = Number(appliedPromo.subscriptionMonths) || 3;
        const premiumUntil = new Date();
        premiumUntil.setMonth(premiumUntil.getMonth() + months);

        await updateDoc(doc(db, 'users', user.uid), {
          subscriptionTier: 'premium',
          premiumUntil: premiumUntil
        });

        await incrementPromoUses(appliedPromo.code);
        alert(`Félicitations! Votre abonnement Premium de ${months} mois a été activé gratuitement.`);
        setAppliedPromo(null);
        setPromoCodeInput('');
        navigate('/user/dashboard');
      } else if (appliedPromo.type === 'unlock_product') {
        const prodId = appliedPromo.productId;
        if (!prodId) {
          alert("ID de l'article manquant dans la configuration du code promo.");
          setLoading(false);
          return;
        }

        const prodSnap = await getDoc(doc(db, 'store_products', prodId));
        const prodName = prodSnap.exists() ? prodSnap.data().name : "votre article";

        const { arrayUnion } = await import('firebase/firestore');
        await updateDoc(doc(db, 'users', user.uid), {
          purchasedItems: arrayUnion(prodId)
        });

        await incrementPromoUses(appliedPromo.code);
        alert(`Félicitations! L'article "${prodName}" a été débloqué et ajouté à votre compte gratuitement.`);
        setAppliedPromo(null);
        setPromoCodeInput('');
        navigate('/user/store');
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de l'activation du code promo.");
    } finally {
      setLoading(false);
    }
  };

  const handleFreeActivation = async () => {
    if (!user || !selectedPlan) return;
    setLoading(true);

    try {
      let months = 3;
      if (selectedPlan.id === 'premium_6m') months = 6;
      if (selectedPlan.id === 'premium_12m') months = 12;

      const premiumUntil = new Date();
      premiumUntil.setMonth(premiumUntil.getMonth() + months);

      await updateDoc(doc(db, 'users', user.uid), {
        subscriptionTier: 'premium',
        premiumUntil: premiumUntil
      });

      if (appliedPromo) {
        await incrementPromoUses(appliedPromo.code);
      }

      alert(t('payment.success', `Félicitations! Vous êtes maintenant abonné au plan ${selectedPlan.name}.`).replace('{plan}', selectedPlan.name));
      setAppliedPromo(null);
      setSelectedPlan(null);
      navigate('/user/dashboard');
    } catch (dbErr) {
      console.error("Failed to update premium status in DB:", dbErr);
      alert("Erreur lors de l'activation.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackPayment = async () => {
    if (!user || !selectedPlan) return;
    
    setLoading(true);
    let pricing = detectUserCurrencyAndPrice(selectedPlan.priceNumber);

    try {
      await PaystackService.initializePaystackPayment(
        user.email || 'user@example.com',
        pricing.price,
        pricing.currency,
        user.uid,
        async (reference) => {
          try {
            let months = 3;
            if (selectedPlan.id === 'premium_6m') months = 6;
            if (selectedPlan.id === 'premium_12m') months = 12;

            const premiumUntil = new Date();
            premiumUntil.setMonth(premiumUntil.getMonth() + months);

            await updateDoc(doc(db, 'users', user.uid), {
              subscriptionTier: 'premium',
              premiumUntil: premiumUntil
            });

            if (appliedPromo) {
              await incrementPromoUses(appliedPromo.code);
            }
          } catch (dbErr) {
            console.error("Failed to update premium status in DB:", dbErr);
          }

          alert(t('payment.success', `Félicitations! Vous êtes maintenant abonné au plan ${selectedPlan.name}.`).replace('{plan}', selectedPlan.name));
          setSelectedPlan(null);
          navigate('/user/dashboard');
        },
        () => {
          console.log(t('payment.cancelled', "Paiement annulé ou fermé."));
        }
      );
    } catch (err) {
      console.error(err);
      alert(t('payment.error', "Une erreur est survenue lors de l'initialisation du paiement."));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(t('payment.fileTooLarge', "Le fichier est trop volumineux. La taille maximale est de 5 Mo."));
      return;
    }

    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDirectPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPlan) return;

    if (!senderName.trim()) {
      setMessageDirect({ text: t('payment.senderRequired', "Veuillez entrer votre nom ou le nom de l'expéditeur."), type: 'error' });
      return;
    }

    setSubmittingDirect(true);
    setMessageDirect(null);

    const pricing = detectUserCurrencyAndPrice(selectedPlan.priceNumber);

    try {
      await addDoc(collection(db, 'manual_payments'), {
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.name || '',
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amount: pricing.price,
        currency: pricing.currency,
        status: 'pending',
        senderName: senderName.trim(),
        transactionRef: transactionRef.trim(),
        proofImage: receiptBase64 || '',
        appliedPromoCode: appliedPromo ? appliedPromo.code : null,
        createdAt: Date.now()
      });

      setMessageDirect({ 
        text: t('payment.submitSuccess', "Votre reçu a été soumis avec succès ! L'administrateur validera votre paiement sous peu pour activer votre accès Premium."), 
        type: 'success' 
      });

      // Clear form
      setSenderName('');
      setTransactionRef('');
      setReceiptBase64(null);
      setReceiptFileName('');
      setTimeout(() => {
        setSelectedPlan(null);
      }, 5000);
    } catch (err) {
      console.error(err);
      setMessageDirect({ text: t('payment.submitError', "Une erreur est survenue lors de la soumission de votre reçu. Veuillez réessayer."), type: 'error' });
    } finally {
      setSubmittingDirect(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const directPaymentDetails = {
    accountName: "Jibril Tengeh",
    accountNumber: "1011103409690",
    bankName: "GCB Bank PLC",
    swiftCode: "GHCBGHAC"
  };

  return (
    <div className="max-w-6xl mx-auto pl-4 pr-6 sm:px-6 lg:px-8 pt-8 pb-40 sm:pb-24">
      <div className="mb-8 text-center sm:text-left">
        <button onClick={handleBack} className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 w-full sm:w-auto">
          <ArrowLeft size={20} />
          <span>{t('payment.back', 'Retour')}</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-3 mb-2">
          <Sparkles className="text-amber-500" />
          {t('payment.title', "Débloquer l'Accès Premium")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm sm:text-base">
          {t('payment.subtitle', "Choisissez le plan qui correspond à vos besoins spirituels.")}
        </p>
        
        <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-center justify-center sm:justify-start text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-3 sm:p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50 w-full overflow-hidden">
          <span className="flex items-center gap-2 text-center sm:text-left"><CreditCard size={16} className="shrink-0" /><span className="leading-tight">Paystack (Automatique : Cartes & Mobile Money)</span></span>
          <span className="text-emerald-300 hidden sm:inline">•</span>
          <span className="flex items-center gap-2 text-center sm:text-left"><Landmark size={16} className="shrink-0" /><span className="leading-tight">Transfert Bancaire Direct (GCB Bank PLC)</span></span>
        </div>
      </div>

      {/* Promo Code Validation Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm text-left">
        <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2 mb-2">
          <Sparkles className="text-amber-500" />
          {t('payment.promoCodeHeader', "Avez-vous un Code Promo ?")}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Saisissez votre code promotionnel pour bénéficier de réductions immédiates sur nos abonnements, débloquer directement un abonnement ou débloquer gratuitement un article spécifique de la boutique.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            type="text"
            placeholder="Saisir le code (ex: ASRAR50)"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
            disabled={applyingPromo}
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-xl p-3 text-sm text-gray-900 dark:text-white uppercase font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:opacity-55"
          />
          <button
            onClick={handleApplyPromoCode}
            disabled={applyingPromo || !promoCodeInput.trim()}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white text-xs font-bold shadow-md transition-all whitespace-nowrap"
          >
            {applyingPromo ? t('payment.applying', "Validation...") : t('payment.apply', "Appliquer le code")}
          </button>
        </div>

        {promoError && (
          <p className="text-xs font-semibold text-red-500 mt-2 flex items-center gap-1">
            ⚠️ {promoError}
          </p>
        )}

        {promoSuccess && (
          <div className="mt-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-3.5 rounded-xl">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
              ✅ {promoSuccess}
            </p>
            {appliedPromo && appliedPromo.type !== 'discount' && (
              <button
                onClick={handleActivateDirectPromo}
                disabled={loading}
                className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5"
              >
                {loading ? "Activation..." : "Débloquer et Activer maintenant"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {plans.map((plan) => {
          const pricing = detectUserCurrencyAndPrice(plan.priceNumber);
          return (
            <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-xl relative overflow-hidden group flex flex-col transition-transform hover:-translate-y-1">
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${plan.color}`}></div>
              <div className="flex flex-row items-center gap-3.5 mb-4 text-left">
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform shrink-0`}>
                  <plan.icon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">{plan.name}</h3>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-0.5">{pricing.displayStr}</p>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 sm:min-h-[48px] text-left text-xs sm:text-sm leading-relaxed">
                {plan.description}
              </p>

              <ul className="space-y-2.5 sm:space-y-4 mb-6 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className={`mt-0.5 p-1 rounded-full bg-gradient-to-r ${plan.color} text-white shrink-0`}>
                      <Check size={10} strokeWidth={4} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribeClick(plan)}
                className={`w-full mt-auto py-2.5 sm:py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 bg-gradient-to-r ${plan.color} text-sm sm:text-base`}
              >
                <Sparkles size={18} />
                {t('payment.choosePlan', 'Choisir ce plan')}
              </button>
            </div>
          );
        })}
      </div>

      {/* History of Manual Payments */}
      {user && manualPayments.length > 0 && (
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="text-emerald-500" />
            {t('payment.directTitle', 'Suivi de vos demandes de paiement direct')}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">
                  <th className="py-3 px-4">{t('payment.directPlan', 'Plan')}</th>
                  <th className="py-3 px-4">{t('payment.directAmount', 'Montant')}</th>
                  <th className="py-3 px-4">{t('payment.directSender', 'Expéditeur')}</th>
                  <th className="py-3 px-4">{t('payment.directSubmitted', 'Soumis le')}</th>
                  <th className="py-3 px-4">{t('payment.directStatus', 'Statut')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-750 text-sm">
                {manualPayments.map((p) => (
                  <tr key={p.id} className="text-gray-700 dark:text-gray-300">
                    <td className="py-3.5 px-4 font-bold">{p.planName}</td>
                    <td className="py-3.5 px-4 font-mono">{p.amount} {p.currency}</td>
                    <td className="py-3.5 px-4">{p.senderName}</td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {new Date(p.createdAt).toLocaleDateString(t('locale', 'fr-FR'), {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                          <Clock size={12} /> {t('payment.statusPending', "En attente d'approbation")}
                        </span>
                      )}
                      {p.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                          <CheckCircle size={12} /> {t('payment.statusApproved', 'Activé / Approuvé')}
                        </span>
                      )}
                      {p.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                          <XCircle size={12} /> {t('payment.statusRejected', 'Rejeté (Vérifiez vos détails)')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Selection & Instruction Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl my-8">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {t('payment.modalSubscription', 'Abonnement :')} {selectedPlan.name}
                </h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  {t('payment.modalTarif', 'Tarif :')} {detectUserCurrencyAndPrice(selectedPlan.priceNumber).displayStr}
                </p>
              </div>
              <button 
                onClick={() => setSelectedPlan(null)} 
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
              {!paymentMethod ? (
                <div className="space-y-4 text-left">
                  {detectUserCurrencyAndPrice(selectedPlan.priceNumber).price === 0 ? (
                    <div className="text-center py-6 space-y-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/50">
                      <Sparkles className="mx-auto text-emerald-500 animate-bounce" size={48} />
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">Abonnement gratuit avec code promo !</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Votre code promo réduit le coût de cet abonnement à 0. Vous pouvez l'activer instantanément sans frais.</p>
                      <button
                        onClick={handleFreeActivation}
                        disabled={loading}
                        className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
                      >
                        {loading ? "Activation..." : "Activer mon abonnement gratuitement"}
                      </button>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{t('payment.modalSelectMethod', 'Sélectionnez votre méthode de paiement')}</h4>
                      
                      {featureToggles?.paystack_enabled === false && featureToggles?.bank_transfer_enabled === false ? (
                        <div className="text-center py-8 text-gray-500 border border-dashed rounded-2xl p-4">
                          ⚠️ Les méthodes de paiement en ligne sont temporairement désactivées par l'administrateur. Veuillez réessayer plus tard.
                        </div>
                      ) : (
                        <>
                          {featureToggles?.paystack_enabled !== false && (
                            <button
                              onClick={() => setPaymentMethod('paystack')}
                              className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 hover:border-emerald-500 dark:border-gray-800 dark:hover:border-emerald-500 rounded-2xl text-left hover:bg-emerald-50/20 dark:hover:bg-emerald-900/10 transition-all group animate-fade-in"
                            >
                              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 group-hover:scale-110 transition-transform shrink-0">
                                <CreditCard size={24} />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-bold text-gray-900 dark:text-white">{t('payment.modalAuto', 'Paiement Automatique')}</h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('payment.modalAutoDesc', 'Payez instantanément par Carte Bancaire ou Mobile Money automatique via Paystack.')}</p>
                              </div>
                            </button>
                          )}

                          {featureToggles?.bank_transfer_enabled !== false && (
                            <button
                              onClick={() => setPaymentMethod('direct')}
                              className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 hover:border-emerald-500 dark:border-gray-800 dark:hover:border-emerald-500 rounded-2xl text-left hover:bg-emerald-50/20 dark:hover:bg-emerald-900/10 transition-all group animate-fade-in"
                            >
                              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 group-hover:scale-110 transition-transform shrink-0">
                                <Landmark size={24} />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-bold text-gray-900 dark:text-white">{t('payment.modalDirect', 'Paiement Direct (Sans Commission)')}</h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('payment.modalDirectDesc', 'Transférez directement sur mon compte GCB Bank PLC, puis soumettez le reçu.')}</p>
                              </div>
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              ) : paymentMethod === 'paystack' ? (
                <div className="text-center py-6 space-y-4">
                  <CreditCard className="mx-auto text-emerald-500 animate-pulse" size={48} />
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">{t('payment.modalRedirecting', 'Redirection vers Paystack...')}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">{t('payment.modalRedirectingDesc', 'Vous allez être redirigé vers la passerelle sécurisée de Paystack pour finaliser le paiement.')}</p>
                  
                  <div className="flex gap-3 pt-4 max-w-xs mx-auto">
                    <button 
                      onClick={() => setPaymentMethod(null)} 
                      className="flex-1 py-2 rounded-xl text-sm font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {t('payment.back', 'Retour')}
                    </button>
                    <button 
                      onClick={handlePaystackPayment}
                      disabled={loading}
                      className="flex-1 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                    >
                      {loading ? t('payment.modalLoading', 'Chargement...') : t('payment.modalContinue', 'Continuer')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <button 
                    onClick={() => setPaymentMethod(null)} 
                    className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    {t('payment.modalChangeMethod', '← Changer de méthode')}
                  </button>

                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-2xl text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                    <p className="font-bold flex items-center gap-1.5 mb-1"><AlertCircle size={14} /> {t('payment.modalInstructions', 'Instructions de Paiement Direct :')}</p>
                    {t('payment.modalInstructionsDesc', "Effectuez le transfert du montant exact de {amount} vers l'une des coordonnées ci-dessous, puis remplissez le formulaire de soumission avec votre reçu d'opération.").replace('{amount}', detectUserCurrencyAndPrice(selectedPlan.priceNumber).displayStr)}
                  </div>

                  {/* Payment Credentials */}
                  <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-750">
                    <div className="flex justify-between items-center text-xs py-1 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-500">{t('payment.modalHolder', 'Nom du compte / Titulaire :')}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 dark:text-white">{directPaymentDetails.accountName}</span>
                        <button 
                          type="button"
                          onClick={() => copyToClipboard(directPaymentDetails.accountName, 'accountName')}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-emerald-500"
                        >
                          {copiedField === 'accountName' ? <span className="text-emerald-500 font-bold">{t('common.copied', 'Copié')}</span> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs py-1 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-500">{t('payment.modalBank', 'Nom de la Banque :')}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 dark:text-white">{directPaymentDetails.bankName}</span>
                        <button 
                          type="button"
                          onClick={() => copyToClipboard(directPaymentDetails.bankName, 'bankName')}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-emerald-500"
                        >
                          {copiedField === 'bankName' ? <span className="text-emerald-500 font-bold">{t('common.copied', 'Copié')}</span> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs py-1 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-500">{t('payment.modalNumber', 'Numéro de compte :')}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{directPaymentDetails.accountNumber}</span>
                        <button 
                          type="button"
                          onClick={() => copyToClipboard(directPaymentDetails.accountNumber, 'accountNumber')}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-emerald-500"
                        >
                          {copiedField === 'accountNumber' ? <span className="text-emerald-500 font-bold">{t('common.copied', 'Copié')}</span> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs py-1">
                      <span className="text-gray-500">{t('payment.modalSwift', 'Code Swift (BIC) :')}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{directPaymentDetails.swiftCode}</span>
                        <button 
                          type="button"
                          onClick={() => copyToClipboard(directPaymentDetails.swiftCode, 'swiftCode')}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-emerald-500"
                        >
                          {copiedField === 'swiftCode' ? <span className="text-emerald-500 font-bold">{t('common.copied', 'Copié')}</span> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submission Form */}
                  <form onSubmit={handleDirectPaymentSubmit} className="space-y-4">
                    <h5 className="font-bold text-sm text-gray-900 dark:text-white border-b pb-2">{t('payment.modalDeclare', 'Déclarez votre transfert')}</h5>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        {t('payment.modalSenderLabel', "Nom de l'expéditeur / Titulaire du compte émetteur *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder={t('payment.modalSenderPlaceholder', 'Ex: Sékou Bireino')}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        {t('payment.modalTxnLabel', 'Numéro de transaction / Référence (Optionnel)')}
                      </label>
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder={t('payment.modalTxnPlaceholder', 'Ex: TXN827189100 ou Réf. Wave')}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        {t('payment.modalReceiptLabel', "Reçu de transfert / Preuve d'opération (Optionnel, Max 5Mo)")}
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">{t('payment.modalUpload', 'Cliquez pour téléverser')}</span> {t('payment.modalUploadDragOrDrop', 'ou glisser-déposer')}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {receiptFileName ? `${t('payment.modalFile', 'Fichier :')} ${receiptFileName}` : t('payment.modalUploadFormat', "PNG, JPG ou JPEG")}
                            </p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                      </div>
                      {receiptBase64 && (
                        <div className="mt-2 p-2 border rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-between">
                          <span className="text-xs text-gray-500 truncate max-w-xs">{t('payment.modalUploadSuccess', 'Aperçu chargé avec succès')}</span>
                          <button type="button" onClick={() => { setReceiptBase64(null); setReceiptFileName(''); }} className="text-xs text-red-500 font-bold hover:underline">{t('payment.modalUploadDelete', 'Supprimer')}</button>
                        </div>
                      )}
                    </div>

                    {messageDirect && (
                      <div className={`p-4 rounded-xl text-xs font-medium leading-relaxed flex items-start gap-2 ${
                        messageDirect.type === 'success' 
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-300'
                          : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-300'
                      }`}>
                        {messageDirect.type === 'success' ? <CheckCircle size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                        <span>{messageDirect.text}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submittingDirect}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all mt-6"
                    >
                      {submittingDirect ? t('payment.modalSubmitting', 'Transmission en cours...') : t('payment.modalSubmitProof', 'Soumettre la preuve de paiement')}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};


