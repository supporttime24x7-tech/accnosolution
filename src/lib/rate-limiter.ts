// In-Memory Sliding-Window Rate Limiter for Login Endpoint
// Blocks automated brute-force attacks, password guessing, and credential stuffing
// Locks out identifiers for 15 minutes after 5 consecutive failed attempts

interface AttemptRecord {
  count: number;
  firstAttemptTime: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const WINDOW_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts?: number;
  lockedUntil?: number;
  remainingLockSeconds?: number;
  error?: string;
}

export function checkLoginRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Check if currently locked
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingLockSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      lockedUntil: record.lockedUntil,
      remainingLockSeconds,
      error: `Security Lockout: Too many failed login attempts. Access is locked for ${Math.ceil(remainingLockSeconds / 60)} more minute(s) to protect this account.`,
    };
  }

  // If window expired, reset record
  if (now - record.firstAttemptTime > WINDOW_DURATION_MS) {
    loginAttempts.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - record.count);
  return { allowed: true, remainingAttempts: remaining };
}

export function recordFailedLoginAttempt(identifier: string): RateLimitResult {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record || now - record.firstAttemptTime > WINDOW_DURATION_MS) {
    loginAttempts.set(identifier, {
      count: 1,
      firstAttemptTime: now,
    });
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS - 1 };
  }

  record.count += 1;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    const remainingLockSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
    return {
      allowed: false,
      lockedUntil: record.lockedUntil,
      remainingLockSeconds,
      error: `Security Lockout: 5 failed attempts reached. This account is locked for 15 minutes to prevent unauthorized access.`,
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_FAILED_ATTEMPTS - record.count,
  };
}

export function resetLoginRateLimit(identifier: string): void {
  loginAttempts.delete(identifier);
}
