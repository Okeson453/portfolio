# Security Architecture

Security practices and Architecture for this portfolio.

## Authentication

### JWT (JSON Web Tokens)

- Issued upon successful login
- Signed with `JWT_SECRET` (server-only)
- Stored in **secure HTTP-only cookies** (not Local Storage)
- Validated on protected routes via middleware
- Short expiry recommended (15 minutes)

### Password Security

- Hashed with `bcryptjs` (v3.0.3)
- Never stored in plaintext
- Minimum requirements enforced during signup
- Rate limiting on login attempts (5 per 10 minutes)

## Middleware Security

All requests pass through `middleware.ts`:

1. **HTTPS Enforcement** (production only)
   - Redirects HTTP → HTTPS
   - Sets HSTS header for 1 year

2. **Rate Limiting**
   - Login: 5 attempts per 10 minutes
   - Register: 3 attempts per hour
   - Contact form: 3 submissions per 5 minutes
   - General API: 100 requests per minute
   - Uses Upstash Redis + in-memory fallback

3. **Security Headers**
   - Content-Security-Policy (CSP)
   - X-Frame-Options: DENY (no iframes)
   - X-Content-Type-Options: nosniff
   - Strict-Transport-Security (HSTS)
   - Referrer-Policy: strict-origin

4. **Authentication Check**
   - Checks JWT on protected routes
   - Redirects to `/login` if token missing/invalid
   - Prevents role escalation (user can't become admin)

## API Security

### Input Validation

All API endpoints validate request body with **Zod schemas**:
- Type checking
- Length restrictions
- Email format validation
- Required field checks

Example (contact form):
```typescript
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10),
});
```

### CORS

Not explicitly configured (Next.js App Router handles cross-origin safely by default).

### SQL Injection Prevention

**Prisma ORM** handles parameterized queries automatically — no SQL strings.

## Secrets Management

| Secret | Storage | Rotation |
|---|---|---|
| `JWT_SECRET` | `.env.local` (never commit) | Can rotate, existing tokens won't work |
| `DATABASE_URL` | Vercel dashboard | Managed by database provider |
| `RESEND_API_KEY` | Vercel dashboard | Rotate annually |
| `ALGOLIA_ADMIN_KEY` | Server-side only (never NEXT_PUBLIC_) | Never expose |
| `UPSTASH_REDIS_REST_TOKEN` | Vercel dashboard | Rotate annually |
| `SENTRY_AUTH_TOKEN` | Vercel dashboard | Rotate annually |

### Best Practices

1. **Never commit `.env.local`**
2. **Never prefix secrets with `NEXT_PUBLIC_`**
3. **Use strong, random secrets** (minimum 32 characters)
4. **Rotate secrets annually**
5. **Use separate secrets for dev, staging, production**

## Data Protection

### Database

- **Encryption at rest** — managed by database provider
- **Encryption in transit** — SSL/TLS connections
- **Access control** — Only app backend can access database
- **Backups** — Managed by database provider

### Contact Form Data

- Validated with Zod
- Rate limited (3 per 5 minutes)
- Sent via Resend (secure third-party email)
- Stored in database (optional)

### User Passwords

- **Never logged or exposed**
- **Hashed with bcryptjs** (salted)
- **Minimum requirements enforced**
- **Reset via secure email link** (if signup/login added)

## Third-Party Services

| Service | Purpose | Permissions | Security |
|---|---|---|---|
| **Vercel** | Hosting | Deploy,  Environment variables | ✅ Secure |
| **PostgreSQL** | Database | CRUD operations | ✅ Secure (SSL/TLS) |
| **Resend** | Email | Send contact notifications | ✅ Secure |
| **Algolia** | Search | Index, query database | ✅ Secure (API keys scoped) |
| **Upstash Redis** | Rate limiting | Read/write cache | ✅ Secure (token-based) |
| **Sentry** | Error tracking | Receive exceptions, performance data | ✅ Secure (DSN is public, auth token is private) |

## Security Checklist

- [x] TypeScript strict mode (no implicit `any`)
- [x] No console.log of secrets
- [x] Input validation (Zod)
- [x] Rate limiting
- [x] HTTPS enforcement (production)
- [x] Security headers
- [x] JWT authentication
- [x] Password hashing (bcryptjs)
- [x] SQL injection prevention (Prisma ORM)
- [x] CSRF protection (Next.js Server Actions)
- [x] No sensitive data in response headers
- [x] No hardcoded secrets in code

## Incident Response

### If a Secret is Exposed

1. **Rotate immediately**
   - Generate new secret
   - Update in Vercel dashboard
   - Redeploy app

2. **Audit**
   - Check logs for unauthorized access
   - Verify database integrity

3. **Review**
   - Update `.gitignore` if needed
   - Add pre-commit hooks to prevent future exposure

### If a Vulnerability is Found

1. **Email:** okeson453@gmail.com
2. **Do not open a public GitHub issue**
3. **Provide full details** of the vulnerability
4. **Allow 48 hours for response**

## Dependencies

Security considerations for key packages:

- `jose` (v6.1.3) — JWT handling (maintained, secure)
- `bcryptjs` (v3.0.3) — Password hashing (maintained, secure)
- `zod` (v3.25.8) — Input validation (maintained, secure)
- `@sentry/nextjs` (v8.0.0) — Error tracking (maintained, secure)
