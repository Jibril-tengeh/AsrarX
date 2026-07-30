import { RestrictionType } from '../components/AccessRestrictionModal';

export interface AccessCheckResult {
  allowed: boolean;
  restrictionType: RestrictionType;
  featureName: string;
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
    return { allowed: false, restrictionType: 'phone_blocked', featureName };
  }

  // 2. Check Download restrictions if feature relates to downloads (PNG, PDF, Parchment, Seals)
  const isDownloadAction =
    featureId.includes('download') ||
    featureId.includes('png') ||
    featureId.includes('pdf') ||
    featureId.includes('parchment') ||
    featureId.includes('khatim');

  if (isDownloadAction) {
    // Global download toggle check
    const globalDownloadDisabled =
      featureToggles.download_global_enabled === 'inactive' ||
      featureToggles.download_global_enabled === 'disabled' ||
      featureToggles.download_global_enabled === false;

    if (globalDownloadDisabled) {
      return { allowed: false, restrictionType: 'download_disabled', featureName };
    }

    // Per-tool download toggle check
    const perToolDownload = featureToggles[`download_${featureId}`];
    if (perToolDownload === 'inactive' || perToolDownload === 'disabled' || perToolDownload === false) {
      return { allowed: false, restrictionType: 'download_disabled', featureName };
    }
  }

  // 3. Check user specific account blocked tools
  if (user?.blockedTools && user.blockedTools.includes(featureId)) {
    return { allowed: false, restrictionType: 'blocked', featureName };
  }

  // 4. Check tool status from featureToggles
  // Key precedence: tool_<id> -> status_<id> -> <id>
  const status =
    featureToggles[`tool_${featureId}`] ||
    featureToggles[`status_${featureId}`] ||
    featureToggles[featureId] ||
    'active';

  if (status === 'disabled' || status === 'blocked' || status === 'inactive') {
    return { allowed: false, restrictionType: 'blocked', featureName };
  }

  if (status === 'maintenance') {
    return { allowed: false, restrictionType: 'maintenance', featureName };
  }

  if (status === 'premium') {
    const hasPremium = isPremium || user?.role === 'admin' || user?.isPremium;
    if (!hasPremium) {
      return { allowed: false, restrictionType: 'premium', featureName };
    }
  }

  return { allowed: true, restrictionType: null, featureName };
}
