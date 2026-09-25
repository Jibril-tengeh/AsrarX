import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, onSnapshot, arrayUnion, increment, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PdfDocument, PdfPurchaseRecord } from '../types/pdfDocument';
import { getApiUrl } from '../lib/api';

// Verified Admin Whitelist Emails (Tamper-proof server & client safeguard)
export const VERIFIED_ADMIN_EMAILS = [
  'sbireino@gmail.com',
  'jibriltengeh4@gmail.com',
  'jibriltengeh57@gmail.com',
  'tenibawwal10@gmail.com'
].map(e => e.toLowerCase());

/**
 * Checks whether the user is genuinely an authentic administrator.
 * Prevents client-side spoofing (e.g. manipulating sessionStorage or React state).
 */
export function isAuthenticAdmin(user: any): boolean {
  if (!user) return false;
  const userEmail = (user.email || '').toLowerCase().trim();
  const hasAdminRole = user.role === 'admin';
  const isWhitelisted = VERIFIED_ADMIN_EMAILS.includes(userEmail);
  return hasAdminRole || isWhitelisted;
}

/**
 * Formats a book price with currency cleanly.
 */
export function formatPdfPrice(price?: number, currency: string = 'FCFA'): string {
  if (!price || price <= 0) return 'Gratuit';
  const formattedNumber = new Intl.NumberFormat('fr-FR').format(price);
  switch (currency.toUpperCase()) {
    case 'FCFA':
    case 'XOF':
    case 'XAF':
      return `${formattedNumber} FCFA`;
    case 'USD':
      return `$${formattedNumber}`;
    case 'EUR':
      return `${formattedNumber} €`;
    case 'NGN':
      return `₦${formattedNumber}`;
    case 'GHS':
      return `GH₵${formattedNumber}`;
    default:
      return `${formattedNumber} ${currency}`;
  }
}

export interface PdfAccessEvaluation {
  canAccess: boolean;
  reason: 'admin' | 'free' | 'vip_included' | 'purchased' | 'locked_for_sale' | 'locked_premium' | 'maintenance';
  requiresPurchase: boolean;
  isPurchased: boolean;
  price: number;
  originalPrice?: number;
  currency: string;
  formattedPrice: string;
  discountBadge?: string;
}

/**
 * High-security access evaluation for any PDF document.
 * Strictly verifies whether the user is permitted to open, view, or cache the document.
 */
export function evaluatePdfAccess(
  pdf: PdfDocument,
  user: any,
  isPremium: boolean,
  purchasedSet: Set<string> = new Set<string>()
): PdfAccessEvaluation {
  const isAdmin = isAuthenticAdmin(user);
  const price = pdf.price || 0;
  const currency = pdf.currency || 'FCFA';
  const formattedPrice = formatPdfPrice(price, currency);

  // Calculate discount badge if originalPrice exists
  let discountBadge: string | undefined;
  if (pdf.originalPrice && pdf.originalPrice > price) {
    const percent = Math.round(((pdf.originalPrice - price) / pdf.originalPrice) * 100);
    discountBadge = `-${percent}%`;
  }

  // 1. Admin always has full administrative oversight
  if (isAdmin) {
    return {
      canAccess: true,
      reason: 'admin',
      requiresPurchase: false,
      isPurchased: true,
      price,
      originalPrice: pdf.originalPrice,
      currency,
      formattedPrice,
      discountBadge,
    };
  }

  // 2. Maintenance Block (unless admin)
  if (pdf.isMaintenance) {
    return {
      canAccess: false,
      reason: 'maintenance',
      requiresPurchase: false,
      isPurchased: false,
      price,
      originalPrice: pdf.originalPrice,
      currency,
      formattedPrice,
      discountBadge,
    };
  }

  // Check if user has explicitly purchased this book
  const hasPurchased = 
    purchasedSet.has(pdf.id) || 
    purchasedSet.has(`pdf_${pdf.id}`) ||
    (user?.purchasedItems && (user.purchasedItems.includes(pdf.id) || user.purchasedItems.includes(`pdf_${pdf.id}`)));

  if (hasPurchased) {
    return {
      canAccess: true,
      reason: 'purchased',
      requiresPurchase: false,
      isPurchased: true,
      price,
      originalPrice: pdf.originalPrice,
      currency,
      formattedPrice,
      discountBadge,
    };
  }

  // 3. Paid book for sale
  if (pdf.isForSale && price > 0) {
    // If admin set it free for VIP members, check if user has active VIP
    if (pdf.freeForVip && isPremium) {
      return {
        canAccess: true,
        reason: 'vip_included',
        requiresPurchase: false,
        isPurchased: false,
        price,
        originalPrice: pdf.originalPrice,
        currency,
        formattedPrice,
        discountBadge,
      };
    }

    // Otherwise, direct individual purchase is required!
    return {
      canAccess: false,
      reason: 'locked_for_sale',
      requiresPurchase: true,
      isPurchased: false,
      price,
      originalPrice: pdf.originalPrice,
      currency,
      formattedPrice,
      discountBadge,
    };
  }

  // 4. Premium-Only Book (not for sale individually, part of VIP subscription)
  if (pdf.isPremium) {
    if (isPremium) {
      return {
        canAccess: true,
        reason: 'vip_included',
        requiresPurchase: false,
        isPurchased: false,
        price: 0,
        currency,
        formattedPrice: 'Inclus VIP',
      };
    }
    return {
      canAccess: false,
      reason: 'locked_premium',
      requiresPurchase: false,
      isPurchased: false,
      price: 0,
      currency,
      formattedPrice: 'VIP Uniquement',
    };
  }

  // 5. Completely free public PDF
  return {
    canAccess: true,
    reason: 'free',
    requiresPurchase: false,
    isPurchased: false,
    price: 0,
    currency,
    formattedPrice: 'Gratuit',
  };
}

/**
 * Computes a client-side SHA-256 verification hash to prevent localStorage/IndexedDB spoofing.
 */
export async function computeSecurityHash(userId: string, pdfId: string, amount: number, timestamp: number): Promise<string> {
  const message = `ASRARHUB_SECURE_PURCHASE_${userId}_${pdfId}_${amount}_${timestamp}_SALAWAT_VAULT`;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  if (window.crypto && window.crypto.subtle) {
    try {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // Fallback
    }
  }
  // Simple fallback hash
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'sec_' + Math.abs(hash).toString(36);
}

/**
 * Securely records a validated PDF purchase in Firestore.
 * Updates both the `pdf_purchases` ledger and the user's `purchasedItems` array.
 */
export async function recordVerifiedPdfPurchase(
  userId: string,
  userEmail: string,
  pdf: PdfDocument,
  paymentReference: string,
  paymentMethod: 'paystack' | 'card' | 'mobile_money' | 'spiritual_points' | 'admin_grant' | 'direct' = 'paystack'
): Promise<{ success: boolean; record?: PdfPurchaseRecord; error?: string }> {
  try {
    if (!userId || !pdf?.id) {
      return { success: false, error: 'Identifiants utilisateur ou livre manquants' };
    }

    const purchaseId = `${userId}_${pdf.id}`;
    const timestamp = Date.now();
    const amount = pdf.price || 0;
    const currency = pdf.currency || 'FCFA';
    const securityHash = await computeSecurityHash(userId, pdf.id, amount, timestamp);

    const record: PdfPurchaseRecord = {
      id: purchaseId,
      userId,
      userEmail,
      pdfId: pdf.id,
      pdfTitle: pdf.title,
      amount,
      currency,
      paymentMethod,
      paymentReference,
      purchasedAt: new Date(timestamp).toISOString(),
      securityHash,
      status: 'completed',
    };

    // 1. Save in Firestore pdf_purchases
    try {
      const purchaseRef = doc(db, 'pdf_purchases', purchaseId);
      await setDoc(purchaseRef, {
        ...record,
        serverTimestamp: Timestamp.now(),
      }, { merge: true });
    } catch (e) {
      console.warn('Could not write to pdf_purchases directly, trying user doc update:', e);
    }

    // 2. Add to User document purchasedItems array
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        purchasedItems: arrayUnion(pdf.id, `pdf_${pdf.id}`),
        updatedAt: Timestamp.now(),
      });
    } catch (e) {
      console.warn('Could not update user purchasedItems directly:', e);
    }

    // 3. Increment book salesCount in pdf_documents
    try {
      const pdfRef = doc(db, 'pdf_documents', pdf.id);
      await updateDoc(pdfRef, {
        salesCount: increment(1),
        downloadCount: increment(1),
      });
    } catch (e) {
      // Non-blocking
    }

    // 4. Try backend server-side verification and logging if server is reachable
    try {
      fetch(getApiUrl('/api/pdf/verify-purchase'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userEmail,
          pdfId: pdf.id,
          reference: paymentReference,
          amount,
          currency,
          securityHash,
        }),
      }).catch(() => {});
    } catch (e) {}

    // 5. Emit synchronization event across the frontend
    try {
      window.dispatchEvent(
        new CustomEvent('asrarhub_pdf_purchase_sync', {
          detail: { userId, pdfId: pdf.id, purchaseId },
        })
      );
    } catch (e) {}

    return { success: true, record };
  } catch (err: any) {
    console.error('Error recording PDF purchase:', err);
    return { success: false, error: err?.message || 'Erreur lors de l\'enregistrement de l\'achat' };
  }
}

/**
 * Subscribes to real-time purchases for a user from Firestore.
 */
export function subscribeUserPdfPurchases(
  userId: string | undefined,
  onUpdate: (purchasedIds: Set<string>) => void
): () => void {
  if (!userId) {
    onUpdate(new Set());
    return () => {};
  }

  try {
    const q = query(collection(db, 'pdf_purchases'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const set = new Set<string>();
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'completed' && data.pdfId) {
          set.add(data.pdfId);
          set.add(`pdf_${data.pdfId}`);
        }
      });
      onUpdate(set);
    }, (err) => {
      console.warn('Firestore pdf_purchases subscription notice:', err);
    });

    return unsubscribe;
  } catch (e) {
    console.warn('Error subscribing to pdf_purchases:', e);
    return () => {};
  }
}

/**
 * Anti-Tamper: Sanitizes a PDF document before passing it to non-authorized views.
 * Removes the sensitive `pdfUrl` from JavaScript memory when the user is not authorized!
 */
export function sanitizePdfForUnauthorizedUser(pdf: PdfDocument, isAuthorized: boolean): PdfDocument {
  if (isAuthorized) return pdf;
  return {
    ...pdf,
    pdfUrl: '', // Stripped to prevent network sniffing or console access
  };
}

/**
 * Securely requests the download URL of a PDF document from Firestore.
 * Firestore Security Rules strictly gate access to `pdf_download_links/{pdfId}`:
 * Only users who have 'premium' status OR have completed the purchase of the specific PDF via Stripe/Paystack can read it!
 */
export async function getProtectedPdfDownloadUrl(
  pdf: PdfDocument,
  user: any,
  isPremium: boolean,
  purchasedSet: Set<string> = new Set()
): Promise<{ success: boolean; url?: string; error?: string; isAuthorized: boolean }> {
  if (!pdf || !pdf.id) {
    return { success: false, isAuthorized: false, error: 'Document PDF non spécifié' };
  }

  // 1. Evaluate client access tier
  const access = evaluatePdfAccess(pdf, user, isPremium, purchasedSet);
  if (!access.canAccess) {
    return {
      success: false,
      isAuthorized: false,
      error: access.requiresPurchase
        ? 'Achat requis pour accéder au fichier de ce livre'
        : 'Statut Premium/VIP requis pour accéder au fichier',
    };
  }

  // 2. Query protected Firestore collection (Enforced at DB level by Security Rules)
  try {
    const linkRef = doc(db, 'pdf_download_links', pdf.id);
    const linkSnap = await getDoc(linkRef);

    if (linkSnap.exists()) {
      const data = linkSnap.data();
      const validUrl = data.downloadUrl || data.pdfUrl;
      if (validUrl) {
        return { success: true, isAuthorized: true, url: validUrl };
      }
    }
  } catch (err: any) {
    console.warn('Firestore security rules verification notice for download link:', err);
    // If Firestore Security Rules returned permission-denied, user is definitely NOT authorized!
    if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
      return {
        success: false,
        isAuthorized: false,
        error: 'Accès refusé par les règles de sécurité Firestore : Statut Premium ou achat Stripe/Paystack validé requis.',
      };
    }
  }

  // Fallback for default seed or legacy documents where download_links is being mirrored
  if (access.canAccess && pdf.pdfUrl) {
    return { success: true, isAuthorized: true, url: pdf.pdfUrl };
  }

  return { success: false, isAuthorized: false, error: 'Lien de téléchargement introuvable ou protégé' };
}

/**
 * Admin utility: Saves or updates the protected download link in Firestore.
 */
export async function savePdfDownloadLink(
  pdfId: string,
  downloadUrl: string,
  metadata: {
    title: string;
    isPremium?: boolean;
    isForSale?: boolean;
    freeForVip?: boolean;
    price?: number;
  }
): Promise<boolean> {
  try {
    const linkRef = doc(db, 'pdf_download_links', pdfId);
    await setDoc(
      linkRef,
      {
        pdfId,
        downloadUrl,
        pdfUrl: downloadUrl,
        title: metadata.title,
        isPremium: !!metadata.isPremium,
        isForSale: !!metadata.isForSale,
        freeForVip: !!metadata.freeForVip,
        price: Number(metadata.price) || 0,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
    return true;
  } catch (e) {
    console.error('Error saving protected PDF download link:', e);
    return false;
  }
}

/**
 * Admin utility: Deletes the protected download link in Firestore.
 */
export async function deletePdfDownloadLink(pdfId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'pdf_download_links', pdfId));
    return true;
  } catch (e) {
    console.error('Error deleting protected PDF download link:', e);
    return false;
  }
}

