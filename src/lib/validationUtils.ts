// Validation utilities for preventing disposable emails, email aliases, and duplicate phone numbers
import { collection, query, where, getDocs } from 'firebase/firestore';

// Comprehensive list of known disposable / temporary email domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com', 'temp-mail.org', 'tempmail.net', 'tempmail.dev', 'temp-mail.io', 'tempmail.co',
  'mailinator.com', 'mailinator.net', 'mailinator.org', 'mailinator2.com',
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.co.uk',
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz', 'guerrillamailblock.com', 'sharklasers.com', 'grr.la',
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc', 'nomail.xl.cx', 'mega.poke.fr', 'badamel.fr.nf', 'courriel.fr.nf',
  'throwawaymail.com', 'trashmail.com', 'trashmail.net', 'trashmail.me', 'dispostable.com',
  'getnada.com', 'abyssmail.com', 'mohmal.com', 'mohmal.in', 'inboxalias.com',
  'crazymailing.com', 'generator.email', 'maildrop.cc', 'mailnesia.com',
  'fake-box.com', 'fakeinbox.com', 'disposablemail.com', 'mytemp.email',
  'emailondeck.com', 'tempail.com', 'burnermail.io', 'getairmail.com',
  'tmpmail.net', 'tmpmail.org', '027168.com', '1000greetings.com',
  'discardmail.com', 'discardmail.de', 'spambog.com', 'spambog.de', 'spambog.ru',
  '0815.ru', '0815.su', '0815.bz', '0815.co', 'anonymbox.com',
  'binkmail.com', 'bobmail.info', 'chammy.info', 'devnullmail.com',
  'dingmail.kicks-ass.net', 'dodgeit.com', 'e4ward.com', 'emailproxsy.com',
  'emlhub.com', 'emlpro.com', 'emltmp.com', 'fake-email.pp.ua',
  'fastmail.fm', 'filzmail.com', 'gishpuppy.com', 'hidemail.de',
  'incognitomail.org', 'instant-email.org', 'kasmail.com', 'keepmymail.com',
  'lhsdv.com', 'maileater.com', 'mailtothis.com', 'meltmail.com',
  'mintemail.com', 'mytrashmail.com', 'no-spam.ws', 'noclickemail.com',
  'nospam4.us', 'nospamthanks.info', 'onesecmail.com', 'onesecmail.net', 'onesecmail.org',
  'pookmail.com', 'safersignup.com', 'spambox.us', 'tempinbox.com',
  'trashmail.net', 'trash-mail.at', 'trash-mail.com', 'trashcanmail.com',
  'wegwerfemail.de', 'wetaint.com', 'wrongmail.com', 'zippymail.in'
]);

// Keywords in domain name that indicate temporary / disposable email service
const DISPOSABLE_KEYWORDS = [
  'tempmail', 'temp-mail', 'mailinator', 'disposable', 'trashmail',
  '10minute', 'guerrilla', 'throwaway', 'yopmail', 'fakeinbox',
  'generator.email', 'burnermail', 'maildrop', 'tmpmail', 'discardmail',
  'anonymbox', 'mytemp', 'emailondeck', 'tempail', 'onesecmail', 'jetable'
];

/**
 * Checks if an email is from a known temporary/disposable email provider
 */
export const isDisposableEmail = (email: string): boolean => {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1].trim().toLowerCase();

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
 */
export const normalizeEmail = (email: string): string => {
  if (!email || !email.includes('@')) return (email || '').trim().toLowerCase();

  const trimmed = email.trim().toLowerCase();
  const parts = trimmed.split('@');
  let localPart = parts[0];
  let domainPart = parts[1];

  // Treat googlemail.com as gmail.com
  if (domainPart === 'googlemail.com') {
    domainPart = 'gmail.com';
  }

  // Strip anything after '+' (email sub-addressing / aliases)
  if (localPart.includes('+')) {
    localPart = localPart.split('+')[0];
  }

  // For Gmail / Googlemail, remove all dots from the username
  if (domainPart === 'gmail.com') {
    localPart = localPart.replace(/\./g, '');
  }

  return `${localPart}@${domainPart}`;
};

/**
 * Clean and normalize a phone number to standard digits with leading '+'
 * Example:
 * - "+221 77 123 45 67" -> "+221771234567"
 * - "00221 77 123 45 67" -> "+221771234567"
 * - "771234567" -> "771234567"
 */
export const normalizePhone = (phone: string): string => {
  if (!phone) return '';
  let cleaned = phone.trim().replace(/[\s\-\(\)\.]/g, '');
  
  // Convert leading 00 to +
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.substring(2);
  }
  
  return cleaned;
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
  // 1. Check for temporary / disposable email
  if (isDisposableEmail(email)) {
    return {
      valid: false,
      error: "Les adresses email temporaires ou jetables (temp mail) ne sont pas autorisées. Veuillez utiliser une adresse email permanente."
    };
  }

  const rawEmail = (email || '').trim().toLowerCase();
  const normEmail = normalizeEmail(rawEmail);
  const normPhone = normalizePhone(phone);

  if (!rawEmail || !rawEmail.includes('@')) {
    return {
      valid: false,
      error: "Veuillez saisir une adresse email valide."
    };
  }

  if (!normPhone || normPhone.replace(/\+/g, '').length < 6) {
    return {
      valid: false,
      error: "Veuillez saisir un numéro de téléphone valide avec l'indicatif du pays."
    };
  }

  try {
    const usersRef = collection(firestoreDb, 'users');
    
    // Query 1: normalizedEmail match
    const qEmail = query(usersRef, where('normalizedEmail', '==', normEmail));
    const snapEmail = await getDocs(qEmail).catch(() => null);
    
    if (snapEmail && !snapEmail.empty) {
      return {
        valid: false,
        error: "Cette adresse email (ou un alias Google/mail de cette adresse) est déjà utilisée par un autre compte."
      };
    }

    // Query 2: normalizedPhone match
    const qPhone = query(usersRef, where('normalizedPhone', '==', normPhone));
    const snapPhone = await getDocs(qPhone).catch(() => null);

    if (snapPhone && !snapPhone.empty) {
      return {
        valid: false,
        error: "Ce numéro de téléphone est déjà associé à un autre compte. Chaque numéro ne peut être utilisé qu'une seule fois."
      };
    }

    // Query 3: legacy phone field match
    const qRawPhone = query(usersRef, where('phone', '==', phone.trim()));
    const snapRawPhone = await getDocs(qRawPhone).catch(() => null);

    if (snapRawPhone && !snapRawPhone.empty) {
      return {
        valid: false,
        error: "Ce numéro de téléphone est déjà associé à un autre compte. Chaque numéro ne peut être utilisé qu'une seule fois."
      };
    }

    // Scan documents to check legacy records without normalizedEmail/normalizedPhone fields
    const allUsersSnap = await getDocs(usersRef).catch(() => null);
    if (allUsersSnap && !allUsersSnap.empty) {
      for (const userDoc of allUsersSnap.docs) {
        const uData = userDoc.data();
        
        // Check email alias match
        if (uData.email) {
          const uNormEmail = normalizeEmail(uData.email);
          if (uNormEmail === normEmail) {
            return {
              valid: false,
              error: "Cette adresse email (ou un alias Google/mail de cette adresse) est déjà utilisée par un autre compte."
            };
          }
        }

        // Check phone match
        if (uData.phone) {
          const uNormPhone = normalizePhone(uData.phone);
          if (uNormPhone === normPhone || uData.phone.trim() === phone.trim()) {
            return {
              valid: false,
              error: "Ce numéro de téléphone est déjà associé à un autre compte. Chaque numéro ne peut être utilisé qu'une seule fois."
            };
          }
        }
      }
    }
  } catch (err) {
    console.warn("Firestore validation check exception:", err);
  }

  // Also check local storage for local emergency sessions
  try {
    const savedLocalUsers = localStorage.getItem('asrarhub_all_local_users');
    if (savedLocalUsers) {
      const usersList = JSON.parse(savedLocalUsers);
      for (const u of usersList) {
        if (u.email && normalizeEmail(u.email) === normEmail) {
          return {
            valid: false,
            error: "Cette adresse email (ou un alias de cette adresse) est déjà enregistrée."
          };
        }
        if (u.phone && normalizePhone(u.phone) === normPhone) {
          return {
            valid: false,
            error: "Ce numéro de téléphone est déjà utilisé par un autre compte. Chaque numéro ne peut être utilisé qu'une seule fois."
          };
        }
      }
    }
  } catch (e) {
    // Ignore localStorage parse errors
  }

  return { valid: true };
};
