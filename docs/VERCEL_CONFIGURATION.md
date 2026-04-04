# Vercel Configuration Reference

## Overview
This document explains the `vercel.json` configuration file used for Vercel deployment.

## Configuration Structure

### Build Commands
```json
{
    "buildCommand": "npm ci && npm run build",     // Clean install + Next.js build
    "devCommand": "npm run dev -- --turbopack",    // Local dev with Turbopack
    "installCommand": "npm ci"                      // Clean dependency install
}
```

**Environment:** Production builds use `npm ci` instead of `npm install` for reproducibility.

### Framework Configuration
```json
{
    "framework": "nextjs",        // Next.js framework detection
    "outputDirectory": ".next"    // Build output location
}
```

**Build Output:** See `next.config.js` for `output: 'standalone'` configuration.

## Scheduled Tasks (Crons)

### Blog Publish
- **Endpoint:** `/api/cron/blog-publish`
- **Schedule:** `0 */6 * * *` (Every 6 hours)
- **Purpose:** Automatically publish scheduled blog posts

### Social Media Share
- **Endpoint:** `/api/cron/social-media-share`
- **Schedule:** `0 9,15 * * *` (9:00 AM and 3:00 PM UTC)
- **Purpose:** Auto-share blog posts to social media platforms

**Note:** Cron handlers require authentication checks in route handlers.

## Security Headers

All HTTP responses include security headers defined in `vercel.json`:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking (frame embedding) |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS protection |
| `Referrer-Policy` | `no-referrer-when-downgrade` | Control referrer information |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Restrict sensitive APIs |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | HSTS enforcement (1 year) |

### Static Assets Caching
Static files (`.next/static/**`) are cached with standard cache headers:
- **Max Age:** 31536000 seconds (1 year)
- **Immutable:** Yes (hash-based versioning)
- **Public:** Yes (can be cached by CDN)

## Environment Variables

All environment variables must be set in the **Vercel Dashboard**:

1. Go to **Dashboard** → **Settings** → **Environment Variables**
2. Add variables for:
   - Database credentials (`DATABASE_URL`)
   - API keys (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`)
   - Service credentials (`JWT_SECRET`, `RESEND_API_KEY`)
   - Feature flags (`NEXT_PUBLIC_*`)

See `docs/ENVIRONMENT.md` for complete variable documentation.

## Deployment Steps

1. **Connect GitHub Repository**
   - Link portfolio repo to Vercel account
   - Select main branch for production deployments

2. **Configure Environment**
   - Set all required environment variables in Vercel Dashboard
   - Verify secrets are not exposed in logs

3. **Deploy**
   - Push to `main` branch triggers automatic deployment
   - Preview deployments created for pull requests
   - Deployment URL: `https://okeson.dev`

## Troubleshooting

### Build Failures
- Check Build Logs in Vercel Dashboard
- Verify Node.js version: 20.x
- Verify `npm ci` succeeds locally: `npm install --legacy-peer-deps`

### Cron Jobs Not Running
- Verify API route exists and returns status 200
- Check authentication in cron handlers is disabled or uses `request.headers.get('Authorization')`
- Monitor cron logs in Vercel Dashboard

### Missing Environment Variables
- Verify all `NEXT_PUBLIC_` and secret variables are set in Vercel Dashboard
- Redeploy after adding new variables
- Check local `.env.local` matches Vercel configuration

## See Also
- [Vercel Deployment Documentation](docs/DEPLOYMENT.md)
- [Environment Variables Reference](docs/ENVIRONMENT.md)
- [Next.js Configuration](next.config.js)
