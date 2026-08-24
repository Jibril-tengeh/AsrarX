import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  increment,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ReferralConfig {
  enabled: boolean;
  rewardHours: number; // 2, 4, 6, 8, 10, 12, etc. (Hours given to the referrer)
  refereeRewardHours: number; // Hours given to the invited user (filleul)
  welcomeTitleFr: string;
  welcomeTitleEn: string;
  welcomeTitleHa: string;
  welcomeMessageFr: string;
  welcomeMessageEn: string;
  welcomeMessageHa: string;
  videoAnimationType: 'gold_celestial' | 'spiritual_aura' | 'cosmic_emerald' | 'sacred_light';
  customVideoUrl?: string;
  spiritualPointsPerReferral: number;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerEmail: string;
  referredId: string;
  referredName: string;
  referredEmail: string;
  referralCode: string;
  rewardHours: number;
  refereeRewardHours: number;
  createdAt: any;
  status: 'active' | 'revoked' | 'completed';
}

export const DEFAULT_REFERRAL_CONFIG: ReferralConfig = {
  enabled: true,
  rewardHours: 6, // Default 6 hours
  refereeRewardHours: 4, // Default 4 hours for the new user
  welcomeTitleFr: "Félicitations ! Cadeau de Parrainage Activé 🎁",
  welcomeTitleEn: "Congratulations! Referral Gift Activated 🎁",
  welcomeTitleHa: "Taya Murna! An Kunna Kyautar Gayyata 🎁",
  welcomeMessageFr: "Bienvenue dans l'univers AsrarHub ! Grâce au code de votre parrain, vous profitez immédiatement d'un accès Premium gratuit et illimité pour explorer tous les secrets sacrés.",
  welcomeMessageEn: "Welcome to the AsrarHub universe! Thanks to your sponsor's code, you immediately enjoy free and unlimited Premium access to explore all sacred secrets.",
  welcomeMessageHa: "Barka da zuwa duniyar AsrarHub! Godiya ga lambar mai gayyatarku, yanzu haka kuna da damar Premium kyauta don bincika dukkan asirai.",
  videoAnimationType: 'gold_celestial',
  customVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1610-large.mp4',
  spiritualPointsPerReferral: 50
};

/**
 * Generate standard clean uppercase referral code for a user
 */
export function generateUserReferralCode(user: { uid: string; name?: string | null }): string {
  if (!user || !user.uid) return 'ASRAR-VIP';
  const cleanUid = user.uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const sub = cleanUid.length >= 6 ? cleanUid.substring(0, 6) : cleanUid.padEnd(6, '7');
  return `ASRAR-${sub}`;
}

/**
 * Fetch current referral configuration from Firestore settings/features
 */
export async function getReferralConfig(): Promise<ReferralConfig> {
  try {
    const featSnap = await getDoc(doc(db, 'settings', 'features')).catch(() => null);
    if (featSnap && featSnap.exists()) {
      const data = featSnap.data();
      return {
        enabled: data.referral_enabled !== false,
        rewardHours: Number(data.referral_reward_hours) || DEFAULT_REFERRAL_CONFIG.rewardHours,
        refereeRewardHours: Number(data.referral_referee_reward_hours) || DEFAULT_REFERRAL_CONFIG.refereeRewardHours,
        welcomeTitleFr: data.referral_welcome_title_fr || DEFAULT_REFERRAL_CONFIG.welcomeTitleFr,
        welcomeTitleEn: data.referral_welcome_title_en || DEFAULT_REFERRAL_CONFIG.welcomeTitleEn,
        welcomeTitleHa: data.referral_welcome_title_ha || DEFAULT_REFERRAL_CONFIG.welcomeTitleHa,
        welcomeMessageFr: data.referral_welcome_message_fr || DEFAULT_REFERRAL_CONFIG.welcomeMessageFr,
        welcomeMessageEn: data.referral_welcome_message_en || DEFAULT_REFERRAL_CONFIG.welcomeMessageEn,
        welcomeMessageHa: data.referral_welcome_message_ha || DEFAULT_REFERRAL_CONFIG.welcomeMessageHa,
        videoAnimationType: data.referral_video_animation_type || DEFAULT_REFERRAL_CONFIG.videoAnimationType,
        customVideoUrl: data.referral_custom_video_url || DEFAULT_REFERRAL_CONFIG.customVideoUrl,
        spiritualPointsPerReferral: Number(data.referral_spiritual_points) || DEFAULT_REFERRAL_CONFIG.spiritualPointsPerReferral
      };
    }
  } catch (e) {
    console.warn("Could not load referral config from Firestore:", e);
  }
  return DEFAULT_REFERRAL_CONFIG;
}

/**
 * Save referral configuration to Firestore
 */
export async function saveReferralConfig(config: Partial<ReferralConfig>): Promise<void> {
  const payload: Record<string, any> = {};
  if (config.enabled !== undefined) payload.referral_enabled = config.enabled;
  if (config.rewardHours !== undefined) payload.referral_reward_hours = Number(config.rewardHours);
  if (config.refereeRewardHours !== undefined) payload.referral_referee_reward_hours = Number(config.refereeRewardHours);
  if (config.welcomeTitleFr !== undefined) payload.referral_welcome_title_fr = config.welcomeTitleFr;
  if (config.welcomeTitleEn !== undefined) payload.referral_welcome_title_en = config.welcomeTitleEn;
  if (config.welcomeTitleHa !== undefined) payload.referral_welcome_title_ha = config.welcomeTitleHa;
  if (config.welcomeMessageFr !== undefined) payload.referral_welcome_message_fr = config.welcomeMessageFr;
  if (config.welcomeMessageEn !== undefined) payload.referral_welcome_message_en = config.welcomeMessageEn;
  if (config.welcomeMessageHa !== undefined) payload.referral_welcome_message_ha = config.welcomeMessageHa;
  if (config.videoAnimationType !== undefined) payload.referral_video_animation_type = config.videoAnimationType;
  if (config.customVideoUrl !== undefined) payload.referral_custom_video_url = config.customVideoUrl;
  if (config.spiritualPointsPerReferral !== undefined) payload.referral_spiritual_points = Number(config.spiritualPointsPerReferral);

  await setDoc(doc(db, 'settings', 'features'), payload, { merge: true });
}

/**
 * Find user matching a referral code
 */
export async function findUserByReferralCode(rawCode: string): Promise<{ uid: string; name?: string; email?: string } | null> {
  if (!rawCode) return null;
  const cleanCode = rawCode.trim().toUpperCase();
  const subCode = cleanCode.replace(/^ASRAR-/, '').trim();

  try {
    // 1. Direct query on referralCode field
    const q1 = query(collection(db, 'users'), where('referralCode', '==', cleanCode), limit(1));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      const uDoc = snap1.docs[0];
      return { uid: uDoc.id, name: uDoc.data().name, email: uDoc.data().email };
    }

    // 2. Query all users (limit reasonable for prefix matching)
    const usersSnap = await getDocs(collection(db, 'users'));
    for (const d of usersSnap.docs) {
      const uId = d.id.toUpperCase();
      const uData = d.data();
      const generated = generateUserReferralCode({ uid: d.id, name: uData.name }).toUpperCase();

      if (cleanCode === generated || cleanCode === uId.substring(0, 8) || (subCode && uId.startsWith(subCode))) {
        return { uid: d.id, name: uData.name, email: uData.email };
      }
    }
  } catch (err) {
    console.warn("Error validating referral code:", err);
  }
  return null;
}

/**
 * Process and reward both referrer and new referee user
 */
export async function processReferralRegistration(params: {
  newUserId: string;
  newUserName?: string | null;
  newUserEmail?: string | null;
  referralCode: string;
}): Promise<{
  success: boolean;
  referrerName?: string;
  rewardHours?: number;
  refereeRewardHours?: number;
  message?: string;
}> {
  const { newUserId, newUserName, newUserEmail, referralCode } = params;
  if (!referralCode || !referralCode.trim()) {
    return { success: false, message: 'Aucun code fourni' };
  }

  try {
    const config = await getReferralConfig();
    if (!config.enabled) {
      return { success: false, message: 'Le système de parrainage est temporairement inactif' };
    }

    const referrer = await findUserByReferralCode(referralCode);
    if (!referrer || referrer.uid === newUserId) {
      return { success: false, message: 'Code de parrainage introuvable ou invalide' };
    }

    const rewardHours = config.rewardHours;
    const refereeRewardHours = config.refereeRewardHours;
    const now = new Date();

    // 1. Calculate & Extend Referrer Premium
    const referrerRef = doc(db, 'users', referrer.uid);
    const referrerSnap = await getDoc(referrerRef).catch(() => null);
    
    let referrerExpiry = new Date(now.getTime() + rewardHours * 60 * 60 * 1000);
    if (referrerSnap && referrerSnap.exists()) {
      const rData = referrerSnap.data();
      const rawCurrentExpiry = rData.premiumUntil || rData.freeTrialExpiresAt;
      if (rawCurrentExpiry) {
        const currentExp = typeof rawCurrentExpiry === 'object' && rawCurrentExpiry.toDate
          ? rawCurrentExpiry.toDate()
          : new Date(rawCurrentExpiry);
        if (!isNaN(currentExp.getTime()) && currentExp > now) {
          // Add hours onto existing active subscription
          referrerExpiry = new Date(currentExp.getTime() + rewardHours * 60 * 60 * 1000);
        }
      }
    }

    // Update referrer user document
    await setDoc(referrerRef, {
      subscriptionTier: 'premium',
      isPremium: true,
      freeTrialActivated: true,
      freeTrialExpiresAt: referrerExpiry.toISOString(),
      premiumUntil: referrerExpiry.toISOString(),
      referralCount: increment(1),
      spiritualPoints: increment(config.spiritualPointsPerReferral || 50),
      lastReferralRewardAt: now.toISOString()
    }, { merge: true });

    // 2. Calculate & Grant Referee (New user) Premium
    const newUserRef = doc(db, 'users', newUserId);
    const refereeExpiry = new Date(now.getTime() + refereeRewardHours * 60 * 60 * 1000);

    await setDoc(newUserRef, {
      referredBy: referrer.uid,
      referredByName: referrer.name || 'Parrain AsrarHub',
      referredWithCode: referralCode.toUpperCase(),
      subscriptionTier: 'premium',
      isPremium: true,
      freeTrialActivated: true,
      freeTrialExpiresAt: refereeExpiry.toISOString(),
      premiumUntil: refereeExpiry.toISOString(),
      referralBonusGranted: true,
      referralBonusHours: refereeRewardHours,
      referralCode: generateUserReferralCode({ uid: newUserId, name: newUserName })
    }, { merge: true });

    // 3. Save detailed transaction record in `referrals` collection
    const recordId = `ref_${Date.now()}_${newUserId.substring(0, 5)}`;
    const referralRecord: ReferralRecord = {
      id: recordId,
      referrerId: referrer.uid,
      referrerName: referrer.name || 'Anonyme',
      referrerEmail: referrer.email || '',
      referredId: newUserId,
      referredName: newUserName || 'Nouvel Utilisateur',
      referredEmail: newUserEmail || '',
      referralCode: referralCode.toUpperCase(),
      rewardHours: rewardHours,
      refereeRewardHours: refereeRewardHours,
      createdAt: serverTimestamp(),
      status: 'active'
    };

    await setDoc(doc(db, 'referrals', recordId), referralRecord);

    return {
      success: true,
      referrerName: referrer.name || 'Votre Parrain',
      rewardHours: rewardHours,
      refereeRewardHours: refereeRewardHours,
      message: `Code de parrainage activé avec succès ! +${refereeRewardHours}h de Premium débloquées.`
    };
  } catch (err: any) {
    console.error("Error processing referral registration:", err);
    return { success: false, message: err?.message || 'Erreur lors du traitement du parrainage' };
  }
}

/**
 * Get all referral records for admin view
 */
export async function getAllReferralsAdmin(): Promise<ReferralRecord[]> {
  try {
    const q = query(collection(db, 'referrals'), orderBy('createdAt', 'desc'), limit(200));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ReferralRecord));
  } catch (e) {
    console.warn("Could not fetch referrals list:", e);
    return [];
  }
}
