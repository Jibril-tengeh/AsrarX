export interface SavedLoginAccount {
  id: string;
  email: string;
  name?: string;
  password?: string;
  savedPassword?: boolean;
  role?: string;
  lastLogin: number;
  photoURL?: string;
  avatarColor?: string;
}

const STORAGE_KEY = 'asrarhub_login_accounts';
const LEGACY_EMAIL_KEY = 'asrarhub_saved_email';
const LEGACY_PASSWORD_KEY = 'asrarhub_saved_password';

const AVATAR_COLORS = [
  'bg-emerald-600 text-white',
  'bg-indigo-600 text-white',
  'bg-amber-600 text-white',
  'bg-teal-600 text-white',
  'bg-cyan-600 text-white',
  'bg-purple-600 text-white',
  'bg-rose-600 text-white',
  'bg-blue-600 text-white'
];

export const getAvatarColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

/**
 * Retrieves all saved login accounts, sorted with most recently used first.
 * Automatically migrates legacy single-credential keys if found.
 */
export const getSavedLoginAccounts = (): SavedLoginAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let accounts: SavedLoginAccount[] = [];

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        accounts = parsed;
      }
    }

    // Check for legacy single-credential entries and migrate
    const legacyEmail = localStorage.getItem(LEGACY_EMAIL_KEY);
    const legacyPassword = localStorage.getItem(LEGACY_PASSWORD_KEY);

    if (legacyEmail && !accounts.some(a => a.email.toLowerCase() === legacyEmail.toLowerCase())) {
      const legacyAccount: SavedLoginAccount = {
        id: legacyEmail.toLowerCase(),
        email: legacyEmail,
        name: legacyEmail.split('@')[0],
        password: legacyPassword || undefined,
        savedPassword: Boolean(legacyPassword),
        lastLogin: Date.now(),
        avatarColor: getAvatarColor(legacyEmail)
      };
      accounts.unshift(legacyAccount);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }

    return accounts.sort((a, b) => (b.lastLogin || 0) - (a.lastLogin || 0));
  } catch (err) {
    console.warn('Failed to parse saved login accounts:', err);
    return [];
  }
};

/**
 * Saves or updates a login account in the login history list.
 */
export const saveLoginAccount = ({
  email,
  password,
  name,
  role,
  photoURL,
  savePassword = true
}: {
  email: string;
  password?: string;
  name?: string;
  role?: string;
  photoURL?: string;
  savePassword?: boolean;
}): SavedLoginAccount[] => {
  if (!email || !email.trim()) return getSavedLoginAccounts();

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = getSavedLoginAccounts();
    const existingIndex = existing.findIndex(a => a.email.toLowerCase() === normalizedEmail);

    let updatedAccount: SavedLoginAccount;

    if (existingIndex >= 0) {
      const prev = existing[existingIndex];
      updatedAccount = {
        ...prev,
        email: email.trim(),
        name: name || prev.name || email.split('@')[0],
        role: role || prev.role,
        photoURL: photoURL || prev.photoURL,
        password: savePassword && password ? password : savePassword ? prev.password : undefined,
        savedPassword: savePassword ? (Boolean(password) || prev.savedPassword) : false,
        lastLogin: Date.now(),
        avatarColor: prev.avatarColor || getAvatarColor(normalizedEmail)
      };
      existing.splice(existingIndex, 1);
    } else {
      updatedAccount = {
        id: normalizedEmail,
        email: email.trim(),
        name: name || email.split('@')[0],
        role,
        photoURL,
        password: savePassword && password ? password : undefined,
        savedPassword: savePassword && Boolean(password),
        lastLogin: Date.now(),
        avatarColor: getAvatarColor(normalizedEmail)
      };
    }

    // Place most recent at top, keep max 10
    const nextList = [updatedAccount, ...existing].slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));

    // Update legacy keys for quick fallback
    if (savePassword) {
      localStorage.setItem(LEGACY_EMAIL_KEY, updatedAccount.email);
      if (updatedAccount.password) {
        localStorage.setItem(LEGACY_PASSWORD_KEY, updatedAccount.password);
      }
    }

    return nextList;
  } catch (err) {
    console.warn('Failed to save login account:', err);
    return getSavedLoginAccounts();
  }
};

/**
 * Removes a specific account from the saved login accounts list.
 */
export const removeSavedLoginAccount = (email: string): SavedLoginAccount[] => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const list = getSavedLoginAccounts().filter(a => a.email.toLowerCase() !== normalizedEmail);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    // If active legacy email matches, update or clear it
    const legacyEmail = localStorage.getItem(LEGACY_EMAIL_KEY);
    if (legacyEmail && legacyEmail.toLowerCase() === normalizedEmail) {
      if (list.length > 0) {
        localStorage.setItem(LEGACY_EMAIL_KEY, list[0].email);
        if (list[0].password) {
          localStorage.setItem(LEGACY_PASSWORD_KEY, list[0].password);
        } else {
          localStorage.removeItem(LEGACY_PASSWORD_KEY);
        }
      } else {
        localStorage.removeItem(LEGACY_EMAIL_KEY);
        localStorage.removeItem(LEGACY_PASSWORD_KEY);
      }
    }

    return list;
  } catch (err) {
    console.warn('Failed to remove saved login account:', err);
    return getSavedLoginAccounts();
  }
};

/**
 * Clears all saved login accounts.
 */
export const clearAllSavedLoginAccounts = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_EMAIL_KEY);
    localStorage.removeItem(LEGACY_PASSWORD_KEY);
  } catch (err) {
    console.warn('Failed to clear saved login accounts:', err);
  }
};
