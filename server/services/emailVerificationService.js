import nodemailer from 'nodemailer';

/**
 * In-memory verification code store.
 * Key: lowercase email
 * Value: { code: string, expiresAt: number, attempts: number, resendCooldown: number }
 */
const verificationStore = new Map();

// Clean up expired verification codes every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, record] of verificationStore.entries()) {
    if (now > record.expiresAt) {
      verificationStore.delete(email);
    }
  }
}, 5 * 60 * 1000);

/**
 * Common typo mappings for popular email domains.
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
 * Validates an email address strictly.
 * For students: STRICTLY ENFORCES @gmail.com.
 */
export function validateEmail(email, role = 'student') {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email address is required.' };
  }

  const clean = email.trim().toLowerCase();

  if (clean.length < 5 || clean.length > 254) {
    return { valid: false, error: 'Email address length is invalid.' };
  }

  // Basic RFC 5322 regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean)) {
    return { valid: false, error: 'Please enter a valid email address (e.g. yourname@gmail.com).' };
  }

  const parts = clean.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid email structure.' };
  }

  const [localPart, domainPart] = parts;

  // Local part checks
  if (localPart.length < 3) {
    return { valid: false, error: 'Email username must be at least 3 characters long.' };
  }
  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return { valid: false, error: 'Email contains invalid consecutive or leading/trailing dots.' };
  }

  // Domain checks
  const domainSegments = domainPart.split('.');
  if (domainSegments.length < 2) {
    return { valid: false, error: 'Email domain is incomplete.' };
  }

  const tld = domainSegments[domainSegments.length - 1];
  // TLD must be purely alphabetical and at least 2 characters (.com, .org, etc. Reject .c)
  if (!/^[a-zA-Z]{2,24}$/.test(tld)) {
    return { valid: false, error: `Invalid domain extension ".${tld}". Top-level domains must be at least 2 letters (e.g. .com).` };
  }

  // Reject any email if raw input had uppercase in domain (e.g. @gMail.com)
  const rawParts = email.trim().split('@');
  if (rawParts.length === 2 && /[A-Z]/.test(rawParts[1])) {
    return {
      valid: false,
      error: 'Email domain extension must be strictly lowercase (e.g. @gmail.com).'
    };
  }

  // STRICT RULE FOR STUDENTS: Must be @gmail.com
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

  // Check for common typo domains (like gma.c, gamil.com, etc.)
  if (DOMAIN_TYPO_MAP[domainPart]) {
    const suggested = DOMAIN_TYPO_MAP[domainPart];
    return {
      valid: false,
      error: `Invalid email domain "@${domainPart}". Did you mean "@${suggested}"?`
    };
  }

  if (domainPart.startsWith('gma') && domainPart !== 'gmail.com') {
    return { valid: false, error: `Invalid email domain "@${domainPart}". Did you mean "@gmail.com"?` };
  }

  return { valid: true, cleanEmail: clean };
}

/**
 * Creates nodemailer transport if SMTP credentials are provided in env.
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const service = process.env.EMAIL_SERVICE;

  if (user && pass) {
    if (service || (user.includes('@gmail.com') && !host)) {
      return nodemailer.createTransport({
        service: service || 'gmail',
        auth: { user, pass }
      });
    }

    return nodemailer.createTransport({
      host: host || 'smtp.gmail.com',
      port,
      secure: process.env.SMTP_SECURE === 'true' || port === 465,
      auth: { user, pass }
    });
  }

  return null;
}

/**
 * Generates and stores a 6-digit verification code, and dispatches it via real email.
 */
export async function sendVerificationCode({ email, name, role }) {
  const validation = validateEmail(email, role);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const cleanEmail = validation.cleanEmail;
  const now = Date.now();

  // Rate limiting check: 60s cooldown between sends
  const existing = verificationStore.get(cleanEmail);
  if (existing && now < existing.resendCooldown) {
    const secondsRemaining = Math.ceil((existing.resendCooldown - now) / 1000);
    throw new Error(`Please wait ${secondsRemaining}s before requesting another verification code.`);
  }

  const transporter = createTransporter();
  if (!transporter) {
    throw new Error(
      'Email dispatch service is not configured. Please configure EMAIL_USER and EMAIL_PASS (Google App Password) in server/.env so the verification code can be delivered to your email inbox.'
    );
  }

  // Generate 6-digit random code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Save to verification store (valid for 10 minutes)
  verificationStore.set(cleanEmail, {
    code,
    expiresAt: now + 10 * 60 * 1000,
    attempts: 0,
    resendCooldown: now + 60 * 1000,
    createdAt: now
  });

  try {
    const roleTitle = role === 'company' ? 'Recruiter' : 'Student';
    const greetingName = name || (role === 'company' ? 'Recruiter' : 'Student');

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Placement Genie'}" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: `Placement Genie Verification Code: ${code}`,
      text: `Hello ${greetingName},\n\nYour Placement Genie registration verification code is: ${code}\n\nThis code will expire in 10 minutes. If you did not request this registration, please ignore this email.\n\nPlacement Genie Platform Team`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 32px; color: #f8fafc; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 12px 20px; background: linear-gradient(135deg, #0284c7, #6366f1); border-radius: 12px; font-weight: 800; font-size: 18px; letter-spacing: 1px; color: #ffffff;">
              🎓 PLACEMENT GENIE
            </div>
          </div>
          
          <h2 style="font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 8px; color: #ffffff;">
            Verify Your ${roleTitle} Email
          </h2>
          
          <p style="text-align: center; color: #94a3b8; font-size: 14px; margin-bottom: 24px; line-height: 1.5;">
            Hello <strong style="color: #e2e8f0;">${greetingName}</strong>, thank you for registering with Placement Genie. Use the 6-digit verification code below to verify your email address:
          </p>

          <div style="background: #1e293b; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; border: 1px solid #334155;">
            <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #38bdf8; letter-spacing: 2px; margin-bottom: 8px;">
              Your Verification Code
            </div>
            <div style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #38bdf8; font-family: monospace;">
              ${code}
            </div>
            <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
              Valid for 10 minutes • Single use only
            </div>
          </div>

          <p style="color: #64748b; font-size: 12px; text-align: center; line-height: 1.5; margin-top: 24px;">
            If you didn't create an account on Placement Genie, you can safely ignore this email.<br/>
            © ${new Date().getFullYear()} Placement Genie. Campus Placement & Assessment Suite.
          </p>
        </div>
      `
    });

    console.log(`[EmailService] ✉️ Verification email delivered via SMTP to: ${cleanEmail}`);
  } catch (sendErr) {
    console.error(`[EmailService] SMTP sending failed for ${cleanEmail}:`, sendErr.message);
    verificationStore.delete(cleanEmail);
    throw new Error(`Failed to send verification email to ${cleanEmail}: ${sendErr.message}`);
  }

  return {
    success: true,
    email: cleanEmail,
    message: `Verification code sent to ${cleanEmail}`
  };
}

/**
 * Verifies a 6-digit code for a given email address.
 */
export function verifyCode({ email, code }) {
  const validation = validateEmail(email);
  if (!validation.valid) {
    return { valid: false, error: validation.error };
  }

  const cleanEmail = validation.cleanEmail;
  const cleanCode = (code || '').toString().trim();

  if (!cleanCode || cleanCode.length !== 6) {
    return { valid: false, error: 'Please enter the complete 6-digit verification code.' };
  }

  const record = verificationStore.get(cleanEmail);
  if (!record) {
    return {
      valid: false,
      error: 'No active verification code found for this email. Please request a new code.'
    };
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    verificationStore.delete(cleanEmail);
    return {
      valid: false,
      error: 'Verification code has expired. Please request a new code.'
    };
  }

  if (record.attempts >= 5) {
    verificationStore.delete(cleanEmail);
    return {
      valid: false,
      error: 'Too many incorrect attempts. For security, please request a new verification code.'
    };
  }

  if (record.code !== cleanCode) {
    record.attempts += 1;
    const remaining = 5 - record.attempts;
    return {
      valid: false,
      error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
    };
  }

  // Correct code - delete to prevent reuse
  verificationStore.delete(cleanEmail);

  return {
    valid: true,
    cleanEmail,
    message: 'Email address verified successfully.'
  };
}
