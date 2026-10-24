/**
 * Client-side email validation and verification service.
 */

const DOMAIN_TYPO_MAP = {
  'g.c': 'gmail.com',
  'g.co': 'gmail.com',
  'g.com': 'gmail.com',
  'gma.c': 'gmail.com',
  'gma.co': 'gmail.com',
  'gma.com': 'gmail.com',
  'gmai.c': 'gmail.com',
  'gmai.co': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmail.c': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmeil.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yaho.co': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outlok.com': 'outlook.com'
};

/**
 * Validates email strictly on client-side before any request is fired.
 * When role is 'student', ONLY @gmail.com is permitted.
 */
export function validateEmailClient(email, role = 'student') {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Please enter your email address.' };
  }

  const clean = email.trim().toLowerCase();

  if (clean.length < 5) {
    return { valid: false, error: 'Please enter a complete email address.' };
  }

  // RFC compliant regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean)) {
    return {
      valid: false,
      error: 'Please enter a valid email format (e.g. yourname@gmail.com).'
    };
  }

  const parts = clean.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid email address structure.' };
  }

  const [localPart, domainPart] = parts;

  // Local part checks
  if (localPart.length < 3) {
    return { valid: false, error: 'Email username must be at least 3 characters long.' };
  }

  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return { valid: false, error: 'Email address contains invalid consecutive or edge dots.' };
  }

  // Domain checks
  const domainSegments = domainPart.split('.');
  if (domainSegments.length < 2) {
    return { valid: false, error: 'Email domain is incomplete.' };
  }

  const tld = domainSegments[domainSegments.length - 1];
  // TLD must be purely alphabetical and at least 2 characters (.com, .org, .in, etc. Reject .c)
  if (!/^[a-zA-Z]{2,24}$/.test(tld)) {
    return {
      valid: false,
      error: `Invalid domain extension ".${tld}". Top-level domains must be at least 2 letters (e.g. .com).`
    };
  }

  // Reject any email if raw input had uppercase in domain (e.g. @gMail.com)
  const rawParts = email.trim().split('@');
  if (rawParts.length === 2 && /[A-Z]/.test(rawParts[1])) {
    return {
      valid: false,
      error: 'Email domain extension must be strictly lowercase (e.g. @gmail.com).'
    };
  }

  // STRICT REQUIREMENT FOR STUDENTS: Must be @gmail.com
  if (role === 'student') {
    if (domainPart !== 'gmail.com') {
      if (DOMAIN_TYPO_MAP[domainPart] || domainPart.startsWith('g')) {
        return {
          valid: false,
          error: `Invalid email domain "@${domainPart}". Students must register strictly with a valid @gmail.com address.`
        };
      }
      return {
        valid: false,
        error: 'Student registration requires a valid email ending strictly with @gmail.com.'
      };
    }
  }

  // Catch common typo domains for other roles
  if (DOMAIN_TYPO_MAP[domainPart]) {
    const suggested = DOMAIN_TYPO_MAP[domainPart];
    return {
      valid: false,
      error: `Invalid email domain "@${domainPart}". Did you mean "@${suggested}"?`
    };
  }

  if (domainPart.startsWith('gma') && domainPart !== 'gmail.com') {
    return {
      valid: false,
      error: `Invalid email domain "@${domainPart}". Did you mean "@gmail.com"?`
    };
  }

  return { valid: true, cleanEmail: clean };
}

/**
 * Requests a 6-digit OTP verification code from the backend.
 */
export async function requestVerificationCode({ email, name, role }) {
  const validation = validateEmailClient(email, role);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const response = await fetch('/api/auth/send-verification-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: validation.cleanEmail,
      name,
      role
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send verification code.');
  }

  return data;
}

/**
 * Submits the 6-digit OTP to the backend to verify the email address.
 */
export async function verifyEmailCode({ email, code }) {
  const validation = validateEmailClient(email);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const cleanCode = (code || '').toString().trim();
  if (!cleanCode || cleanCode.length !== 6) {
    throw new Error('Please enter the complete 6-digit verification code.');
  }

  const response = await fetch('/api/auth/verify-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: validation.cleanEmail,
      code: cleanCode
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Invalid or expired verification code.');
  }

  return data;
}
