export function isNewUserPremiumEnabled(featureToggles?: any): boolean {
  if (featureToggles && featureToggles.new_user_premium_enabled !== undefined) {
    return Boolean(featureToggles.new_user_premium_enabled);
  }
  try {
    const cached = localStorage.getItem('asrar_font_toggles') || localStorage.getItem('asrar_feature_toggles');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.new_user_premium_enabled !== undefined) {
        return Boolean(parsed.new_user_premium_enabled);
      }
    }
  } catch (_) {}
  return true; // Default is enabled (true), can be disabled by admin
}

export function getTrialDurationHours(featureToggles?: any): number {
  if (featureToggles && featureToggles.trial_duration_hours !== undefined) {
    const num = Number(featureToggles.trial_duration_hours);
    if (!isNaN(num) && num > 0) return num;
  }
  try {
    const cached = localStorage.getItem('asrar_feature_toggles') || localStorage.getItem('asrar_font_toggles');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.trial_duration_hours !== undefined) {
        const num = Number(parsed.trial_duration_hours);
        if (!isNaN(num) && num > 0) return num;
      }
    }
  } catch (_) {}
  return 12;
}

export function calculateTrialExpiryDate(startDate?: Date | string, hours?: number): Date {
  const durationHours = hours && hours > 0 ? hours : getTrialDurationHours();
  const start = startDate ? (startDate instanceof Date ? startDate : new Date(startDate)) : new Date();
  const baseTime = isNaN(start.getTime()) ? Date.now() : start.getTime();
  return new Date(baseTime + durationHours * 60 * 60 * 1000);
}

