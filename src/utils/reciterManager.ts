import { QURAN_RECITERS, QuranReciter } from '../data/reciters';
import { SACRED_RECITERS, ReciterOption } from '../components/ContemplativeAudioPlayer';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ManagedQuranReciter extends QuranReciter {
  enabled: boolean;
  isCustom?: boolean;
}

export interface ManagedSacredReciter extends ReciterOption {
  enabled: boolean;
  isCustom?: boolean;
}

/**
 * Returns effective active Quran reciters after filtering out disabled ones
 * and merging custom reciters and overrides.
 */
export function getEffectiveQuranReciters(featureToggles: any): QuranReciter[] {
  const disabledIds: string[] = featureToggles?.disabled_reciters || [];
  const customReciters: QuranReciter[] = featureToggles?.custom_reciters || [];
  const overrides: Record<string, Partial<QuranReciter>> = featureToggles?.custom_reciter_overrides || {};

  const builtInWithOverrides = QURAN_RECITERS.map(r => {
    if (overrides[r.id]) {
      return { ...r, ...overrides[r.id] };
    }
    return r;
  });

  const all = [...builtInWithOverrides, ...customReciters];
  return all.filter(r => !disabledIds.includes(r.id));
}

/**
 * Returns all Quran reciters with their enabled status for Admin Panel management
 */
export function getAllQuranReciters(featureToggles: any): ManagedQuranReciter[] {
  const disabledIds: string[] = featureToggles?.disabled_reciters || [];
  const customReciters: QuranReciter[] = featureToggles?.custom_reciters || [];
  const overrides: Record<string, Partial<QuranReciter>> = featureToggles?.custom_reciter_overrides || {};

  const builtInManaged: ManagedQuranReciter[] = QURAN_RECITERS.map(r => {
    const override = overrides[r.id] || {};
    return {
      ...r,
      ...override,
      enabled: !disabledIds.includes(r.id),
      isCustom: false,
    };
  });

  const customManaged: ManagedQuranReciter[] = customReciters.map(r => ({
    ...r,
    enabled: !disabledIds.includes(r.id),
    isCustom: true,
  }));

  return [...builtInManaged, ...customManaged];
}

/**
 * Returns effective active Sacred Reciters for Contemplative Audio Player
 */
export function getEffectiveSacredReciters(featureToggles: any): ReciterOption[] {
  const disabledIds: string[] = featureToggles?.sacred_disabled_reciters || [];
  const customReciters: ReciterOption[] = featureToggles?.sacred_custom_reciters || [];
  const overrides: Record<string, Partial<ReciterOption>> = featureToggles?.sacred_reciter_overrides || {};

  const builtInWithOverrides = SACRED_RECITERS.map(r => {
    if (overrides[r.id]) {
      return { ...r, ...overrides[r.id] };
    }
    return r;
  });

  const all = [...builtInWithOverrides, ...customReciters];
  return all.filter(r => !disabledIds.includes(r.id));
}

/**
 * Returns all Sacred Reciters with enabled status for Admin Panel
 */
export function getAllSacredReciters(featureToggles: any): ManagedSacredReciter[] {
  const disabledIds: string[] = featureToggles?.sacred_disabled_reciters || [];
  const customReciters: ReciterOption[] = featureToggles?.sacred_custom_reciters || [];
  const overrides: Record<string, Partial<ReciterOption>> = featureToggles?.sacred_reciter_overrides || {};

  const builtInManaged: ManagedSacredReciter[] = SACRED_RECITERS.map(r => {
    const override = overrides[r.id] || {};
    return {
      ...r,
      ...override,
      enabled: !disabledIds.includes(r.id),
      isCustom: false,
    };
  });

  const customManaged: ManagedSacredReciter[] = customReciters.map(r => ({
    ...r,
    enabled: !disabledIds.includes(r.id),
    isCustom: true,
  }));

  return [...builtInManaged, ...customManaged];
}

/**
 * Toggle a single Quran reciter status
 */
export async function toggleQuranReciter(featureToggles: any, reciterId: string, enable: boolean): Promise<void> {
  const disabledIds: string[] = featureToggles?.disabled_reciters || [];
  let updated: string[];
  if (enable) {
    updated = disabledIds.filter(id => id !== reciterId);
  } else {
    updated = disabledIds.includes(reciterId) ? disabledIds : [...disabledIds, reciterId];
  }
  await setDoc(doc(db, 'settings', 'features'), {
    disabled_reciters: updated
  }, { merge: true });
}

/**
 * Toggle a single Sacred reciter status
 */
export async function toggleSacredReciter(featureToggles: any, reciterId: string, enable: boolean): Promise<void> {
  const disabledIds: string[] = featureToggles?.sacred_disabled_reciters || [];
  let updated: string[];
  if (enable) {
    updated = disabledIds.filter(id => id !== reciterId);
  } else {
    updated = disabledIds.includes(reciterId) ? disabledIds : [...disabledIds, reciterId];
  }
  await setDoc(doc(db, 'settings', 'features'), {
    sacred_disabled_reciters: updated
  }, { merge: true });
}

/**
 * Bulk action for Quran reciters
 */
export async function bulkUpdateQuranReciters(
  featureToggles: any, 
  action: 'enable_all' | 'disable_all' | 'reset'
): Promise<void> {
  if (action === 'reset') {
    await setDoc(doc(db, 'settings', 'features'), {
      disabled_reciters: [],
      custom_reciters: [],
      custom_reciter_overrides: {}
    }, { merge: true });
    return;
  }

  if (action === 'enable_all') {
    await setDoc(doc(db, 'settings', 'features'), {
      disabled_reciters: []
    }, { merge: true });
    return;
  }

  if (action === 'disable_all') {
    const all = getAllQuranReciters(featureToggles);
    const allIds = all.map(r => r.id);
    await setDoc(doc(db, 'settings', 'features'), {
      disabled_reciters: allIds
    }, { merge: true });
    return;
  }
}

/**
 * Bulk action for Sacred reciters
 */
export async function bulkUpdateSacredReciters(
  featureToggles: any, 
  action: 'enable_all' | 'disable_all' | 'reset'
): Promise<void> {
  if (action === 'reset') {
    await setDoc(doc(db, 'settings', 'features'), {
      sacred_disabled_reciters: [],
      sacred_custom_reciters: [],
      sacred_reciter_overrides: {}
    }, { merge: true });
    return;
  }

  if (action === 'enable_all') {
    await setDoc(doc(db, 'settings', 'features'), {
      sacred_disabled_reciters: []
    }, { merge: true });
    return;
  }

  if (action === 'disable_all') {
    const all = getAllSacredReciters(featureToggles);
    const allIds = all.map(r => r.id);
    await setDoc(doc(db, 'settings', 'features'), {
      sacred_disabled_reciters: allIds
    }, { merge: true });
    return;
  }
}

/**
 * Save or edit a Quran Reciter
 */
export async function saveQuranReciter(
  featureToggles: any,
  reciter: QuranReciter,
  isCustom: boolean
): Promise<void> {
  if (isCustom) {
    const existingCustom: QuranReciter[] = featureToggles?.custom_reciters || [];
    const index = existingCustom.findIndex(r => r.id === reciter.id);
    let updated: QuranReciter[];
    if (index >= 0) {
      updated = [...existingCustom];
      updated[index] = reciter;
    } else {
      updated = [...existingCustom, reciter];
    }
    await setDoc(doc(db, 'settings', 'features'), {
      custom_reciters: updated
    }, { merge: true });
  } else {
    // Save as override for built-in reciter
    const overrides: Record<string, Partial<QuranReciter>> = featureToggles?.custom_reciter_overrides || {};
    const updatedOverrides = {
      ...overrides,
      [reciter.id]: {
        name: reciter.name,
        nameAr: reciter.nameAr,
        country: reciter.country,
        server: reciter.server,
        apiId: reciter.apiId,
        hasDirectApi: reciter.hasDirectApi
      }
    };
    await setDoc(doc(db, 'settings', 'features'), {
      custom_reciter_overrides: updatedOverrides
    }, { merge: true });
  }
}

/**
 * Save or edit a Sacred Reciter
 */
export async function saveSacredReciter(
  featureToggles: any,
  reciter: ReciterOption,
  isCustom: boolean
): Promise<void> {
  if (isCustom) {
    const existingCustom: ReciterOption[] = featureToggles?.sacred_custom_reciters || [];
    const index = existingCustom.findIndex(r => r.id === reciter.id);
    let updated: ReciterOption[];
    if (index >= 0) {
      updated = [...existingCustom];
      updated[index] = reciter;
    } else {
      updated = [...existingCustom, reciter];
    }
    await setDoc(doc(db, 'settings', 'features'), {
      sacred_custom_reciters: updated
    }, { merge: true });
  } else {
    const overrides: Record<string, Partial<ReciterOption>> = featureToggles?.sacred_reciter_overrides || {};
    const updatedOverrides = {
      ...overrides,
      [reciter.id]: {
        nameFr: reciter.nameFr,
        nameEn: reciter.nameEn,
        shortName: reciter.shortName
      }
    };
    await setDoc(doc(db, 'settings', 'features'), {
      sacred_reciter_overrides: updatedOverrides
    }, { merge: true });
  }
}

/**
 * Delete a custom Quran Reciter
 */
export async function deleteCustomQuranReciter(featureToggles: any, reciterId: string): Promise<void> {
  const existingCustom: QuranReciter[] = featureToggles?.custom_reciters || [];
  const updated = existingCustom.filter(r => r.id !== reciterId);
  await setDoc(doc(db, 'settings', 'features'), {
    custom_reciters: updated
  }, { merge: true });
}

/**
 * Delete a custom Sacred Reciter
 */
export async function deleteCustomSacredReciter(featureToggles: any, reciterId: string): Promise<void> {
  const existingCustom: ReciterOption[] = featureToggles?.sacred_custom_reciters || [];
  const updated = existingCustom.filter(r => r.id !== reciterId);
  await setDoc(doc(db, 'settings', 'features'), {
    sacred_custom_reciters: updated
  }, { merge: true });
}
