import { NextRequest, NextResponse } from 'next/server';
import { signAuthToken } from '@/lib/auth';
import { authenticateEmployee, syncServerEmployees } from '@/lib/employee-registry';
import { checkLoginRateLimit, recordFailedLoginAttempt, resetLoginRateLimit } from '@/lib/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const body = await req.json();

    // Accept employeeId or email with length constraints against payload/ReDoS attacks
    const employeeId = (body.employeeId || body.empCode || body.email || '').trim();
    const password = (body.password || '').trim();

    if (employeeId.length > 100 || password.length > 128) {
      return NextResponse.json(
        { success: false, error: 'Malformed credential payload.' },
        { status: 400 }
      );
    }

    // Rate Limit Key combines client IP and Employee ID to prevent distributed or targeted brute-forcing
    const rateLimitKey = `${ip}:${employeeId.toUpperCase()}`;

    // REQUIREMENT 2: Brute-Force & Credential Theft Protection
    const rateCheck = checkLoginRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: rateCheck.error || 'Too many failed login attempts. Account temporarily locked for 15 minutes.',
          code: 'RATE_LIMIT_EXCEEDED',
          lockedUntil: rateCheck.lockedUntil,
        },
        { status: 429 }
      );
    }

    // REQUIREMENT 3: Do not grant access without a valid employee ID and password
    if (!employeeId || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter both your Employee ID and Password to sign in.',
          code: 'CREDENTIALS_REQUIRED',
        },
        { status: 400 }
      );
    }

    // Authenticate Employee against verified registry
    const authResult = await authenticateEmployee(employeeId, password);

    if (!authResult.success || !authResult.user) {
      // Record failed attempt for rate limiting
      const rateResult = recordFailedLoginAttempt(rateLimitKey);

      let errorMessage = authResult.error || 'Invalid Employee ID or Password. Access denied.';
      if (rateResult.remainingAttempts !== undefined && rateResult.remainingAttempts > 0 && rateResult.remainingAttempts <= 3) {
        errorMessage += ` (${rateResult.remainingAttempts} attempt(s) remaining before security lockout)`;
      } else if (!rateResult.allowed) {
        errorMessage = rateResult.error || errorMessage;
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          code: 'INVALID_CREDENTIALS',
          remainingAttempts: rateResult.remainingAttempts,
        },
        { status: authResult.status || 401 }
      );
    }

    // Login Succeeded: Reset Rate Limiter
    resetLoginRateLimit(rateLimitKey);

    const user = authResult.user;

    // Generate Cryptographically Signed JWT Token (8 Hour Expiration)
    const token = await signAuthToken({
      userId: user.id,
      empCode: user.empCode,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful. Welcome to ACCNO ERP.',
      data: {
        user: {
          id: user.id,
          empCode: user.empCode,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          designation: user.designation,
        },
        redirectTo: user.redirectTo,
      },
    });

    // REQUIREMENT 2: Hack-Proof Cookie Protection
    // httpOnly: true prevents client JavaScript / XSS from reading or stealing credentials
    // sameSite: 'lax' prevents cross-site CSRF attacks
    // secure: true in production prevents network eavesdropping
    const isProduction = process.env.NODE_ENV === 'production';

    response.cookies.set('accno_erp_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    // Also set legacy cookie for full compatibility
    response.cookies.set('omnicrm_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Security Error during authentication.' },
      { status: 500 }
    );
  }
}
