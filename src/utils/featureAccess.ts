import { RestrictionType } from '../components/AccessRestrictionModal';

export interface AccessCheckResult {
  allowed: boolean;
  restrictionType: RestrictionType;
  featureName: string;
  status: string;
}

/**
 * Validates whether a user can access a specific feature, sub-tool, or download,
 * checking global tool status (active, premium, maintenance, disabled),
 * download policies (global & per-tool download toggles), and account blocks.
 */
export function checkFeatureAccess(
  featureId: string,
  featureName: string,
  featureToggles: any,
  user: any,
  isPremium: boolean
): AccessCheckResult {
  if (!featureToggles) {
    featureToggles = {};
  }

  // 1. Check if user's account or phone number is individually blocked
  const blockedPhonesRaw = featureToggles.blocked_phone_numbers || '';
  const blockedPhonesList = Array.isArray(blockedPhonesRaw)
    ? blockedPhonesRaw
    : typeof blockedPhonesRaw === 'string'
      ? blockedPhonesRaw.split(',').map((s: string) => s.trim())
      : [];

  const userPhone = user?.phoneNumber || user?.phone || '';
  if (userPhone && blockedPhonesList.some((p: string) => p && userPhone.includes(p))) {
    return { allowed: false, restrictionType: 'phone_blocked', featureName, status: 'phone_blocked' };
  }

  // 2. Check Download restrictions if feature relates to downloads (PNG, PDF, Parchment, Seals)
  const isDownloadAction =
    featureId.includes('download') ||
    featureId.includes('png') ||
    featureId.includes('pdf_download') ||
    featureId.includes('parchment') ||
    featureId.includes('khatim');

  if (isDownloadAction) {
    // Global download toggle check
    const globalDownloadDisabled =
      featureToggles.download_global_enabled === 'inactive' ||
      featureToggles.download_global_enabled === 'disabled' ||
      featureToggles.download_global_enabled === false;

    if (globalDownloadDisabled) {
      return { allowed: false, restrictionType: 'download_disabled', featureName, status: 'download_disabled' };
    }

    // Per-tool download toggle check
    const perToolDownload = featureToggles[`download_${featureId}`];
    if (perToolDownload === 'inactive' || perToolDownload === 'disabled' || perToolDownload === false) {
      return { allowed: false, restrictionType: 'download_disabled', featureName, status: 'download_disabled' };
    }
  }

  // 3. Check user specific account blocked tools
  if (user?.blockedTools && user.blockedTools.includes(featureId)) {
    return { allowed: false, restrictionType: 'blocked', featureName, status: 'blocked' };
  }

  // Check user tool override if configured specifically by admin
  const userOverride = user?.toolOverrides?.[featureId] || 
    (featureId === 'pdf-library' ? user?.toolOverrides?.['pdf'] : featureId === 'pdf' ? user?.toolOverrides?.['pdf-library'] : undefined);

  // 4. Check tool status from featureToggles or userOverride
  let status = 'active';
  if (userOverride && userOverride !== 'default') {
    status = userOverride;
  } else {
    // Check aliases
    const aliases = [featureId];
    if (featureId === 'pdf' || featureId === 'pdf-library') {
      aliases.push('pdf', 'pdf-library');
    }
    if (featureId === 'sacred-books' || featureId === 'books') {
      aliases.push('sacred-books', 'books');
    }
    if (featureId === 'al-buni-shams' || featureId === 'shams' || featureId === 'buni') {
      aliases.push('al-buni-shams', 'shams', 'buni');
    }

    for (const id of aliases) {
      const found = featureToggles[`tool_${id}`] || featureToggles[`status_${id}`] || featureToggles[id];
      if (found) {
        status = found;
        break;
      }
    }
  }

  if (status === 'disabled' || status === 'blocked' || status === 'inactive') {
    return { allowed: false, restrictionType: 'blocked', featureName, status };
  }

  if (status === 'maintenance') {
    return { allowed: false, restrictionType: 'maintenance', featureName, status: 'maintenance' };
  }

  if (status === 'premium') {
    const hasPremium = isPremium || user?.role === 'admin' || user?.isPremium;
    if (!hasPremium) {
      return { allowed: false, restrictionType: 'premium', featureName, status: 'premium' };
    }
  }

  return { allowed: true, restrictionType: null, featureName, status };
}
