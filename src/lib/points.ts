import { db } from './firebase';
import { doc, updateDoc, increment, arrayUnion, addDoc, collection } from 'firebase/firestore';

export interface PointsTransaction {
  userId: string;
  points: number;
  type: 'ad_reward' | 'content_unlock' | 'admin_adjust';
  itemId?: string;
  timestamp: number;
  description: string;
}

/**
 * Earn spiritual points by watching ads, daily rewards, etc.
 */
export async function earnPoints(userId: string, amount: number, description: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  
  // 1. Update the main user document
  await updateDoc(userRef, {
    spiritualPoints: increment(amount)
  });

  // 2. Add transaction record to 'user_points' collection
  await addDoc(collection(db, 'user_points'), {
    userId,
    points: amount,
    type: 'ad_reward',
    timestamp: Date.now(),
    description
  });
}

/**
 * Spend spiritual points to unlock an article or other premium item.
 */
export async function spendPoints(userId: string, amount: number, itemId: string, description: string): Promise<void> {
  const userRef = doc(db, 'users', userId);

  // 1. Update the main user document (deduct points and add to purchasedItems list)
  await updateDoc(userRef, {
    spiritualPoints: increment(-amount),
    purchasedItems: arrayUnion(itemId)
  });

  // 2. Add transaction record to 'user_points' collection
  await addDoc(collection(db, 'user_points'), {
    userId,
    points: -amount,
    type: 'content_unlock',
    itemId,
    timestamp: Date.now(),
    description
  });
}
