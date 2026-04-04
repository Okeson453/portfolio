# Environment Variables Reference

All environment variables required and optional for this portfolio.

## How to Use

1. Copy `.env.example` to `.env.local`
2. Fill in each variable according to the table below
3. **Never commit `.env.local`** — it contains secrets
4. In Vercel dashboard, add these variables under **Project Settings → Environment Variables**

---

## Required Variables (Tier 1)

These must be set for the app to run.

| Variable | Value | Where to Get | Type |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://okeson.dev` | Your domain or Vercel URL | string |
| `DATABASE_URL` | PostgreSQL connection string | Your database provider (Vercel Postgres, Supabase, etc.) | string |
| `JWT_SECRET` | 32-character random string | Generate: `openssl rand -hex 32` | string |

---

## Email (Tier 2)

| Variable | Value | Where to Get | Type | Safe for Public? |
|---|---|---|---|---|
| `RESEND_API_KEY` | API key | https://resend.com/api-keys | string | ❌ NO |
| `EMAIL_FROM` | `noreply@okeson.dev` | Your domain | string | ✅ YES |
| `EMAIL_REPLY_TO` | `okeson453@gmail.com` | Your email | string | ✅ YES (if OK with),  ❌ NO (if private) |

---

## Search (Algolia)

| Variable | Value | Where to Get | Type | Safe for Public? |
|---|---|---|---|---|
| `ALGOLIA_APP_ID` | App ID | https://dashboard.algolia.com → API Keys | string | ✅ YES (search-only) |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | Search-only key | https://dashboard.algolia.com → API Keys | string | ✅ YES |
| `ALGOLIA_ADMIN_KEY` | Admin key | https://dashboard.algolia.com → API Keys | string | ❌ **NEVER** expose publicly |

---

## Rate Limiting (Upstash Redis)

| Variable | Value | Where to Get | Type | Safe for Public? |
|---|---|---|---|---|
| `UPSTASH_REDIS_REST_URL` | REST endpoint URL | https://console.upstash.com → Your Database | string | ⚠️ SEMI-PUBLIC |
| `UPSTASH_REDIS_REST_TOKEN` | REST API token | https://console.upstash.com → Your Database | string | ❌ NO |

---

## Error Tracking (Sentry)

| Variable | Value | Where to Get | Type | Safe for Public? |
|---|---|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | DSN URL | https://sentry.io → Settings → Client Keys (DSN) | string | ✅ YES (DSN is public) |
| `SENTRY_AUTH_TOKEN` | Auth token | https://sentry.io → Settings → Auth Tokens | string | ❌ NO |
| `SENTRY_ORG` | Organization slug | https://sentry.io → Organization settings | string | ✅ YES |
| `SENTRY_PROJECT` | Project slug | https://sentry.io → Project settings | string | ✅ YES |

---

## CAPTCHA (Cloudflare Turnstile)

| Variable | Value | Where to Get | Type | Safe for Public? |
|---|---|---|---|---|
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | Site key | https://dash.cloudflare.com → Turnstile | string | ✅ YES |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Secret key | https://dash.cloudflare.com → Turnstile | string | ❌ NO |

---

## Other

| Variable | Value | Where to Get | Type | Safe for Public? |
|---|---|---|---|---|
| `SECURITY_WEBHOOK_URL` | Webhook URL | Discord/Slack webhook | string | ❌ NO |

---

## Summary

### Safe to Prefix with `NEXT_PUBLIC_` (exposed to browser)
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`
- `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`

### Never Prefix with `NEXT_PUBLIC_` (server-side only)
- `DATABASE_URL`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `ALGOLIA_ADMIN_KEY`
- `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_AUTH_TOKEN`
- `CLOUDFLARE_TURNSTILE_SECRET_KEY`
- `SECURITY_WEBHOOK_URL`
