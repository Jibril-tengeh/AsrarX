// Validation utilities for preventing disposable emails, email aliases, and duplicate phone numbers
import { collection, query, where, getDocs } from 'firebase/firestore';

// Comprehensive list of known disposable / temporary email domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com', 'temp-mail.org', 'tempmail.net', 'tempmail.dev', 'temp-mail.io', 'tempmail.co', 'tempmail.us', 'tempmail.plus', 'tempmail.ninja', 'tempmail.app',
  'mailinator.com', 'mailinator.net', 'mailinator.org', 'mailinator2.com', 'mailinator.co', 'mailinator.info',
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.co.uk', '10minutemail.de',
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz', 'guerrillamailblock.com', 'sharklasers.com', 'grr.la', 'guerrillamail.de',
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc', 'nomail.xl.cx', 'mega.poke.fr', 'badamel.fr.nf', 'courriel.fr.nf', 'yopmail.kro.kr',
  'throwawaymail.com', 'trashmail.com', 'trashmail.net', 'trashmail.me', 'trash-mail.at', 'trash-mail.com', 'dispostable.com',
  'getnada.com', 'abyssmail.com', 'mohmal.com', 'mohmal.in', 'mohmal.im', 'inboxalias.com', 'inboxkitten.com',
  'crazymailing.com', 'generator.email', 'maildrop.cc', 'mailnesia.com', 'mailcatch.com',
  'fake-box.com', 'fakeinbox.com', 'disposablemail.com', 'mytemp.email', 'fakemailgenerator.com',
  'emailondeck.com', 'tempail.com', 'burnermail.io', 'getairmail.com', 'airmail.news',
  'tmpmail.net', 'tmpmail.org', '027168.com', '1000greetings.com', 'tempmailo.com',
  'discardmail.com', 'discardmail.de', 'spambog.com', 'spambog.de', 'spambog.ru', 'spambox.us',
  '0815.ru', '0815.su', '0815.bz', '0815.co', 'anonymbox.com', 'binkmail.com', 'bobmail.info',
  'chammy.info', 'devnullmail.com', 'dingmail.kicks-ass.net', 'dodgeit.com', 'e4ward.com',
  'emailproxsy.com', 'emlhub.com', 'emlpro.com', 'emltmp.com', 'fake-email.pp.ua', 'fastmail.fm',
  'filzmail.com', 'gishpuppy.com', 'hidemail.de', 'incognitomail.org', 'instant-email.org',
  'kasmail.com', 'keepmymail.com', 'lhsdv.com', 'maileater.com', 'mailtothis.com', 'meltmail.com',
  'mintemail.com', 'mytrashmail.com', 'no-spam.ws', 'noclickemail.com', 'nospam4.us',
  'nospamthanks.info', 'onesecmail.com', 'onesecmail.net', 'onesecmail.org', 'pookmail.com',
  'safersignup.com', 'tempinbox.com', 'trashcanmail.com', 'wegwerfemail.de', 'wetaint.com', 'wrongmail.com', 'zippymail.in',
  'bupya.com', 'vmani.com', 'cefsf.com', 'rmqkr.net', 'mvrht.net', 'btcmod.com', 'd41.co', 'flecto.net'
]);

// Keywords in domain name that indicate temporary / disposable email service
const DISPOSABLE_KEYWORDS = [
  'tempmail', 'temp-mail', 'mailinator', 'disposable', 'trashmail',
  '10minute', 'guerrilla', 'throwaway', 'yopmail', 'fakeinbox',
  'generator.email', 'burnermail', 'maildrop', 'tmpmail', 'discardmail',
  'anonymbox', 'mytemp', 'emailondeck', 'tempail', 'onesecmail', 'jetable',
  'fakemail', 'trash-mail', 'mohmal', 'mailnesia', 'dispostable', 'getnada',
  'inboxkitten', 'tempinbox', 'wegwerf', 'dropmail', 'fake-mail', 'trash',
  '20minute', '33mail', 'spambox', 'spambog', '0815', 'binkmail',
  'bobmail', 'devnull', 'dodgeit', 'e4ward', 'emailproxsy', 'emlhub', 'emlpro',
  'emltmp', 'filzmail', 'gishpuppy', 'hidemail', 'incognitomail', 'instant-email',
  'kasmail', 'keepmymail', 'lhsdv', 'maileater', 'mailtothis', 'meltmail',
  'mintemail', 'mytrashmail', 'noclickemail', 'pookmail', 'safersignup',
  'trashcanmail', 'wetaint', 'wrongmail', 'zippymail', 'bupya', 'vmani', 'cefsf',
  'rmqkr', 'mvrht', 'btcmod', 'flecto', 'armyspy', 'cuvox', 'dayrep', 'einrot',
  'fleckens', 'gustr', 'jourrapide', 'rhyta', 'superrito', 'teleworm', 'tinypm', 'trbvm'
];

/**
 * Checks if an email is from a known temporary/disposable email provider
 */
export const isDisposableEmail = (email: string): boolean => {
  if (!email || !email.includes('@')) return false;
  const parts = email.split('@');
  const domain = parts[parts.length - 1].trim().toLowerCase();

  // Check exact domain match
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return true;
  }

  // Check domain keyword patterns
  for (const keyword of DISPOSABLE_KEYWORDS) {
    if (domain.includes(keyword)) {
      return true;
    }
  }

  return false;
};

/**
 * Normalizes an email address to detect aliases (Gmail dots, plus signs, googlemail domain)
 * Example:
 * - jibriltengeh.57@gmail.com -> jibriltengeh57@gmail.com
 * - jibriltengeh57+test@gmail.com -> jibriltengeh57@gmail.com
 * - jibriltengeh57@googlemail.com -> jibriltengeh57@gmail.com
 * - sbir.eino+123@gmail.com -> sbireino@gmail.com
 */
export const normalizeEmail = (email: string): string => {
  if (!email || !email.includes('@')) return (email || '').trim().toLowerCase();

  const trimmed = email.trim().toLowerCase();
  const parts = trimmed.split('@');
  let localPart = parts[0];
  let domainPart = parts.slice(1).join('@');

  // Treat googlemail.com and google.com as gmail.com
  if (domainPart === 'googlemail.com' || domainPart === 'google.com') {
    domainPart = 'gmail.com';
  }

  // Strip anything after '+' (email sub-addressing / aliases for Gmail, Outlook, Yahoo, iCloud, etc.)
  if (localPart.includes('+')) {
    localPart = localPart.split('+')[0];
  }

  // Strip all dots from localPart for alias normalization
  localPart = localPart.replace(/\./g, '');

  return `${localPart}@${domainPart}`;
};

/**
 * Clean and normalize a phone number to standard digits with leading '+'
 * Example:
 * - "+233 550 418 909" -> "+233550418909"
 * - "00233 550 418 909" -> "+233550418909"
 * - "233550418909" -> "+233550418909"
 */
export const normalizePhone = (phone: string): string => {
  if (!phone) return '';
  let cleaned = phone.trim().replace(/[\s\-\(\)\.]/g, '');
  
  // Convert leading 00 to +
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.substring(2);
  } else if (!cleaned.startsWith('+') && cleaned.length >= 8) {
    // If digits only without leading +, add +
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
};

/**
 * Robust phone number comparison that handles international formats, leading 0s, and country codes
 */
export const arePhoneNumbersEqual = (p1: string, p2: string): boolean => {
  if (!p1 || !p2) return false;
  const d1 = p1.replace(/\D/g, '');
  const d2 = p2.replace(/\D/g, '');
  
  if (!d1 || !d2) return false;
  if (d1 === d2) return true;

  // Compare trailing 7, 8, or 9 digits if both numbers have at least 7 digits
  if (d1.length >= 7 && d2.length >= 7) {
    const minLen = Math.min(d1.length, d2.length, 9);
    for (let len = minLen; len >= 7; len--) {
      if (d1.slice(-len) === d2.slice(-len)) {
        return true;
      }
    }
  }

  return false;
};

export interface RegistrationValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates registration eligibility for phone uniqueness, temporary email prevention, and email alias detection.
 */
export const validateRegistrationDetails = async (
  email: string,
  phone: string,
  firestoreDb: any
): Promise<RegistrationValidationResult> => {
  const rawEmail = (email || '').trim().toLowerCase();
  const normEmail = normalizeEmail(rawEmail);
  const normPhone = normalizePhone(phone);
  const rawPhoneTrim = (phone || '').trim();

  // 1. Check for temporary / disposable email
  if (rawEmail && isDisposableEmail(rawEmail)) {
    return {
      valid: false,
      error: "Les adresses email temporaires ou jetables (temp mail) ne sont pas autorisées. Veuillez utiliser une adresse email permanente."
    };
  }

  if (rawEmail && !rawEmail.includes('@')) {
    return {
      valid: false,
      error: "Veuillez saisir une adresse email valide."
    };
  }

  if (phone && (!normPhone || normPhone.replace(/\+/g, '').length < 6)) {
    return {
      valid: false,
      error: "Veuillez saisir un numéro de téléphone valide avec l'indicatif du pays (ex: +233 550 418 909)."
    };
  }

  try {
    if (firestoreDb) {
      const usersRef = collection(firestoreDb, 'users');
      
      // Query 1: normalizedEmail match
      if (normEmail) {
        const qEmailNorm = query(usersRef, where('normalizedEmail', '==', normEmail));
        const snapEmailNorm = await getDocs(qEmailNorm).catch(() => null);
        if (snapEmailNorm && !snapEmailNorm.empty) {
          return {
            valid: false,
            error: "Cette adresse email (ou un alias Google/mail de cette adresse) est déjà utilisée par un autre compte."
          };
        }

        const qEmailRaw = query(usersRef, where('email', '==', rawEmail));
        const snapEmailRaw = await getDocs(qEmailRaw).catch(() => null);
        if (snapEmailRaw && !snapEmailRaw.empty) {
          return {
            valid: false,
            error: "Cette adresse email est déjà enregistrée. Veuillez vous connecter."
          };
        }
      }

      // Query 2: normalizedPhone and raw phone match
      if (normPhone) {
        const qPhoneNorm = query(usersRef, where('normalizedPhone', '==', normPhone));
        const snapPhoneNorm = await getDocs(qPhoneNorm).catch(() => null);
        if (snapPhoneNorm && !snapPhoneNorm.empty) {
          return {
            valid: false,
            error: `Le numéro de téléphone ${normPhone} est déjà utilisé par un autre compte. Chaque numéro ne peut être utilisé qu'une seule fois.`
          };
        }

        const qPhoneRaw = query(usersRef, where('phone', '==', rawPhoneTrim));
        const snapPhoneRaw = await getDocs(qPhoneRaw).catch(() => null);
        if (snapPhoneRaw && !snapPhoneRaw.empty) {
          return {
            valid: false,
            error: `Le numéro de téléphone ${rawPhoneTrim} est déjà utilisé par un autre compte. Chaque numéro ne peut être utilisé qu'une seule fois.`
          };
        }
      }

      // Query 3: Full documents scan for legacy documents without normalized fields
      const allUsersSnap = await getDocs(usersRef).catch(() => null);
      if (allUsersSnap && !allUsersSnap.empty) {
        for (const userDoc of allUsersSnap.docs) {
          const uData = userDoc.data();
          
          // Check email alias match against existing user email
          if (normEmail) {
            if (uData.email) {
              const uNormEmail = normalizeEmail(uData.email);
              if (uNormEmail === normEmail || uData.email.trim().toLowerCase() === rawEmail) {
                return {
                  valid: false,
                  error: "Cette adresse email (ou un alias de cette adresse) est déjà utilisée par un autre compte."
                };
              }
            }
            if (uData.normalizedEmail && uData.normalizedEmail === normEmail) {
              return {
                valid: false,
                error: "Cette adresse email (ou un alias de cette adresse) est déjà utilisée par un autre compte."
              };
            }
          }

          // Check phone match against existing user phone using arePhoneNumbersEqual
          if (rawPhoneTrim) {
            if (uData.phone && arePhoneNumbersEqual(uData.phone, rawPhoneTrim)) {
              return {
                valid: false,
                error: `Le numéro de téléphone (${rawPhoneTrim}) est déjà associé à un autre compte. Chaque numéro ne peut être utilisé qu'une seule fois.`
              };
            }
            if (uData.normalizedPhone && arePhoneNumbersEqual(uData.normalizedPhone, rawPhoneTrim)) {
              return {
                valid: false,
                error: `Le numéro de téléphone (${rawPhoneTrim}) est déjà associé à un autre compte. Chaque numéro ne peut être utilisé qu'une seule fois.`
              };
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn("Firestore validation check exception:", err);
  }

  // Also check local storage for local backup sessions
  try {
    const savedLocalUsers = localStorage.getItem('asrarhub_all_local_users');
    if (savedLocalUsers) {
      const usersList = JSON.parse(savedLocalUsers);
      for (const u of usersList) {
        if (rawEmail && u.email && (normalizeEmail(u.email) === normEmail || u.email.trim().toLowerCase() === rawEmail)) {
          return {
            valid: false,
            error: "Cette adresse email (ou un alias de cette adresse) est déjà enregistrée."
          };
        }
        if (rawPhoneTrim && u.phone && arePhoneNumbersEqual(u.phone, rawPhoneTrim)) {
          return {
            valid: false,
            error: `Le numéro de téléphone (${rawPhoneTrim}) est déjà utilisé par un autre compte. Chaque numéro ne peut être utilisé qu'une seule fois.`
          };
        }
      }
    }
  } catch (e) {
    // Ignore localStorage parse errors
  }

  return { valid: true };
};
