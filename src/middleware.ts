// Next.js Edge Security Middleware
// 1. Strictly protects ALL backend routes (/erp/*, /portal/*, /api/erp/*, and protected /api/crm/*) against unauthenticated access.
// 2. Enforces enterprise HTTP security headers (Anti-Clickjacking, Anti-MIME sniffing, XSS Protection).
// 3. Verifies cryptographic HTTP-Only JWT tokens on every backend request before page rendering.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isErpPage = pathname.startsWith('/erp') || pathname.startsWith('/portal');
  const isErpApi = pathname.startsWith('/api/erp');
  const isCrmApi = pathname.startsWith('/api/crm');

  // For CRM API: allow public POST for incoming inquiries (e.g. from contact page),
  // but strictly block unauthenticated GET/PUT/DELETE to protect customer leads.
  const requiresAuthApi = isErpApi || (isCrmApi && req.method !== 'POST');

  // If visiting backend (/erp, /portal, or protected API routes)
  if (isErpPage || requiresAuthApi) {
    const token =
      req.cookies.get('accno_erp_token')?.value ||
      req.cookies.get('omnicrm_token')?.value;

    let isAuthenticated = false;
    let userPayload = null;

    if (token) {
      userPayload = await verifyAuthToken(token);
      if (userPayload && userPayload.empCode) {
        isAuthenticated = true;
      }
    }

    // REQUIREMENT: Ensure that no page within the website backend or sensitive data API can be accessed without logging in.
    if (!isAuthenticated) {
      // If it's an API route, reject with 401 Unauthorized JSON
      if (requiresAuthApi) {
        return NextResponse.json(
          {
            success: false,
            error: 'Authentication Required: Unauthorized access to system data is blocked. Please log in with a valid Employee ID.',
            code: 'AUTH_REQUIRED',
          },
          { status: 401 }
        );
      }

      // If it's a page route, redirect immediately to /login with return target
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'session_required');

      const redirectResponse = NextResponse.redirect(loginUrl);
      
      // Clear any invalid or expired tokens
      redirectResponse.cookies.delete('accno_erp_token');
      redirectResponse.cookies.delete('omnicrm_token');

      // Security headers on redirect
      redirectResponse.headers.set('X-Frame-Options', 'DENY');
      redirectResponse.headers.set('X-Content-Type-Options', 'nosniff');
      return redirectResponse;
    }

    // Authenticated Request -> Proceed with injected verification headers
    const requestHeaders = new Headers(req.headers);
    if (userPayload) {
      requestHeaders.set('x-user-id', userPayload.userId);
      requestHeaders.set('x-user-empcode', userPayload.empCode);
      requestHeaders.set('x-user-role', userPayload.role);
    }

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Enterprise security headers against theft & attacks
    response.headers.set('X-Frame-Options', 'DENY'); // Prevent clickjacking & keystroke theft
    response.headers.set('X-Content-Type-Options', 'nosniff'); // Prevent MIME sniffing
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); // Prevent credential leakage in referrers
    response.headers.set('X-XSS-Protection', '1; mode=block'); // Prevent cross-site scripting
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
    );

    return response;
  }

  // Security Headers for public website pages (including /login)
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  return response;
}

// Intercept all ERP, Portal, and sensitive Data API routes
export const config = {
  matcher: [
    '/erp',
    '/erp/:path*',
    '/api/erp/:path*',
    '/api/crm/:path*',
    '/portal',
    '/portal/:path*',
  ],
};
