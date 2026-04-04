/**
 * Next.js Middleware
 * 
 * DEPLOYMENT: Runs on ALL routes (Edge runtime on Vercel)
 * RESPONSIBILITIES:
 * - HTTPS enforcement
 * - Rate limiting (Redis + in-memory fallback)
 * - JWT authentication for protected routes
 * - Security headers (CSP, HSTS, X-Frame-Options, etc.)
 * - Cache control headers
 * 
 * REQUIRED ENVIRONMENT VARIABLES:
 * - UPSTASH_REDIS_REST_URL (rate limiting)
 * - UPSTASH_REDIS_REST_TOKEN (rate limiting)
 * - JWT_SECRET (authentication)
 * 
 * PROTECTED ROUTES:
 * - /dashboard/* (requires authentication)
 * - /settings/* (requires authentication)
 * - /admin/* (requires admin role)
 * 
 * See docs/DEPLOYMENT.md for middleware configuration details.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth/tokens'
import { rateLimit, RATE_LIMIT_CONFIG } from '@/lib/security/rateLimiter'
import crypto from 'crypto'

// ===== SECURITY HEADERS =====
// Hardened CSP: No unsafe-inline, no unsafe-eval. Strict directives.
// NOTE: CSP with 'nonce-' is dynamically set per-request in middleware()
function generateCSP(nonce: string): string {
    return [
        "default-src 'self'",
        // Script: No unsafe-eval, nonce for inline scripts (hydration), limited external sources
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://cdn.jsr.in https://cdn.sentry-cdn.com https://cdn.vercel-insights.com`,
        // Style: Only from self (Tailwind) and trusted CDN, allow nonce for inline styles
        `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
        // Images: Allow self, data URLs for optimized images, https only
        "img-src 'self' data: blob: https:",
        // Fonts: Google Fonts + gstatic
        "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
        // Connect: self + https, websockets for real-time, Sentry + analytics
        "connect-src 'self' https: wss: https://*.sentry.io https://posthog.com https://vitals.vercel-insights.com",
        // Media: Self only
        "media-src 'self'",
        // Frame: Prevent clickjacking
        "frame-ancestors 'none'",
        // Base URI: Self only
        "base-uri 'self'",
        // Form: Self only
        "form-action 'self'",
        // Upgrade all insecure requests to HTTPS
        "upgrade-insecure-requests",
    ].join('; ')
}

// ===== HELPER FUNCTION: Apply Security Headers =====
function applySecurityHeaders(response: NextResponse, csp: string): void {
    response.headers.set('Content-Security-Policy', csp)
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    )
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
    )
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // ===== GENERATE NONCE FOR CSP =====
    // Create a cryptographically secure random nonce per request
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
    const csp = generateCSP(nonce)

    // ===== HTTPS ENFORCEMENT (Production) =====
    if (
        process.env.NODE_ENV === 'production' &&
        request.headers.get('x-forwarded-proto') !== 'https'
    ) {
        return NextResponse.redirect(
            `https://${request.nextUrl.host}${request.nextUrl.pathname}${request.nextUrl.search}`,
            { status: 301 }
        )
    }

    // ===== RATE LIMITING =====
    // Apply rate limiting to sensitive endpoints with route-specific limits
    let rateLimitKey: keyof typeof RATE_LIMIT_CONFIG | null = null;

    if (pathname === '/api/auth/login' || pathname === '/login') {
        rateLimitKey = 'login'; // Stricter: 5/10min
    } else if (pathname === '/api/auth/register' || pathname === '/signup') {
        rateLimitKey = 'register'; // 3/1hr
    } else if (pathname === '/api/contact') {
        rateLimitKey = 'contact'; // 3/5min
    } else if (pathname.startsWith('/api/')) {
        rateLimitKey = 'api'; // General API: 100/min
    }

    if (rateLimitKey) {
        const config = RATE_LIMIT_CONFIG[rateLimitKey];
        const rateLimitResult = await rateLimit(request, rateLimitKey, config);
        if (!rateLimitResult.success) {
            return new NextResponse(JSON.stringify({
                error: 'Too Many Requests',
                message: `Rate limit exceeded. Please try again in ${rateLimitResult.reset || 60} seconds.`,
                retryAfter: rateLimitResult.reset || 60,
            }), {
                status: 429,
                statusText: 'Too Many Requests',
                headers: {
                    'Retry-After': (rateLimitResult.reset || 60).toString(),
                    'Content-Type': 'application/json',
                }
            })
        }
    }

    // ===== AUTH CHECKS =====
    // Protected routes - ONLY these need auth checks
    const protectedRoutes = ['/dashboard', '/settings', '/admin']
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    if (isProtectedRoute) {
        const token = request.cookies.get('auth_token')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            const payload = await verifyAuth(token)

            // Check admin routes
            if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }

            // Add security headers
            const response = NextResponse.next()
            response.headers.set('x-nonce', nonce)
            applySecurityHeaders(response, csp)

            return response
        } catch (_error) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // ===== ADD SECURITY HEADERS TO ALL ROUTES =====
    const response = NextResponse.next()
    response.headers.set('x-nonce', nonce)
    applySecurityHeaders(response, csp)

    // ===== CACHE HEADERS =====
    // Static assets: 1 year immutable cache
    if (/\.(js|css|woff|woff2|eot|ttf|otf)$/.test(pathname)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }
    // Images: 1 year cache (versioned by Next.js)
    else if (/\.(png|jpg|jpeg|gif|webp|avif|svg)$/.test(pathname)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }
    // API responses: 60 seconds with stale-while-revalidate
    else if (pathname.startsWith('/api/')) {
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    }
    // HTML pages: No cache, but allow revalidation
    else if (pathname.endsWith('.html') || !pathname.includes('.')) {
        response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    }

    return response
}

// ✅ CRITICAL: Only run middleware on routes that actually need it!
// Security headers applied to all routes, auth only on protected paths, rate limiting on API/auth
export const config = {
    matcher: [
        // Protected routes (auth required)
        '/dashboard/:path*',
        '/settings/:path*',
        '/admin/:path*',
        // API routes (rate limit + security headers)
        '/api/:path*',
        // Auth routes (rate limit + security headers)
        '/login',
        '/signup',
        // All other routes (security headers only) - use negative lookahead to exclude static files
        '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)).*)',
    ],
}