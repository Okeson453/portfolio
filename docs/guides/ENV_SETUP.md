# Environment Variables Setup Guide

## Overview

Environment variables store sensitive information and configuration that varies between environments (development, staging, production). They should **NEVER** be committed to Git.

---

## File Structure

### .env.example (Commit to GitHub)
Template file showing what variables are needed:
```bash
# DO NOT ADD SECRETS HERE - THIS WILL BE COMMITTED TO GITHUB
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
JWT_SECRET=placeholder_change_me
```

### .env.local (DO NOT COMMIT - Local Development)
Contains actual secrets for your local machine:
```bash
# This file is in .gitignore - never committed
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
JWT_SECRET=your_actual_secret_32_character_hex_string
```

### .env.production (Deployment Platform)
Set in deployment platform dashboard, never in files.

---

## Required Environment Variables

### 1. Application URLs

**NEXT_PUBLIC_APP_URL** (Required)
- Frontend application URL
- Used for: Canonical URLs, redirects, social sharing
- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

**NEXT_PUBLIC_API_URL** (Required)
- Backend API endpoint
- Used for: API calls, form submissions
- Development: `http://localhost:8000` or leave blank if same server
- Production: `https://api.your-domain.com` or `https://your-domain.com/api`

```javascript
// Example usage in code
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

fetch(`${API_URL}/contact`, { method: 'POST', body: data })
```

### 2. Security

**JWT_SECRET** (Required)
- Secret key for JWT token signing
- Used for: Authentication, session management
- Must be: 32+ character random hex string
- KEEP SECRET: Never expose in client-side code

**Generate JWT_SECRET:**

**On Windows (PowerShell):**
```powershell
# Generate 32-byte random hex string
$secret = [System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
Write-Host $secret
# Copy the output to .env.local as JWT_SECRET
```

**On macOS/Linux:**
```bash
openssl rand -hex 32
```

**Or use online generator (less secure):**
```
https://generate-random.org/
# Generate 64 character hex string
```

```javascript
// Example: Never expose this on client
import jwt from 'jsonwebtoken';

const token = jwt.sign({ userId: 123 }, process.env.JWT_SECRET, { expiresIn: '7d' });
```

### 3. Optional: Analytics

**NEXT_PUBLIC_GA_ID** (Optional)
- Google Analytics ID
- Format: `G_XXXXXXXXXX`
- Get from: https://analytics.google.com
- Used for: Website analytics tracking

```javascript
// Example: Safe to expose (NEXT_PUBLIC_ prefix)
import { analyticsId } = process.env.NEXT_PUBLIC_GA_ID;
gtag('config', analyticsId);
```

### 4. Optional: Email Service

**RESEND_API_KEY** (Optional - for contact form)
- Resend email service API key
- Get from: https://resend.com
- Used for: Sending contact form emails
- Do NOT use NEXT_PUBLIC_ prefix (keep secret)

```javascript
// Example: Server-side only
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({ from: 'onboarding@resend.dev', to: email, html: body });
```

### 5. Optional: Error Tracking

**SENTRY_AUTH_TOKEN** (Optional)
- Sentry error tracking authentication
- Get from: https://sentry.io
- Used for: Production error monitoring

---

## Setup Instructions

### Local Development (.env.local)

1. **Create .env.local file:**
```bash
cd portfolio
echo "" > .env.local
```

2. **Copy from template:**
```bash
cp .env.example .env.local
```

3. **Edit .env.local and add real values:**
```bash
# Windows: notepad .env.local
# macOS/Linux: nano .env.local
```

4. **Final .env.local should look like:**
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
NEXT_PUBLIC_GA_ID=G_1234567890

RESEND_API_KEY=re_1234567890abcdef
```

5. **Verify it's in .gitignore:**
```bash
grep ".env.local" .gitignore
# Should output: .env.local
```

6. **Test local development:**
```bash
npm run dev
# Should start without errors
```

---

### Production Deployment (Vercel)

1. **Login to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Go to Project → Settings → Environment Variables**

3. **Click "Add New"** for each variable:

| Key | Value | Scope |
|-----|-------|-------|
| NEXT_PUBLIC_APP_URL | `https://your-domain.com` | Production |
| NEXT_PUBLIC_API_URL | `https://api.your-domain.com` | Production |
| JWT_SECRET | `your_32_char_hex_string` | Production |
| NEXT_PUBLIC_GA_ID | `G_XXXXXXXXXX` | Production |
| RESEND_API_KEY | `re_xxxxx` | Production |

4. **Redeploy after adding variables:**
   - Deployments → Click latest → Redeploy

---

### Production Deployment (Netlify)

1. **Login to Netlify Dashboard**
   - https://app.netlify.com

2. **Go to Site Settings → Build & Deploy → Environment**

3. **Click "Edit Variables"** and add:
```
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
JWT_SECRET=your_32_char_hex_string
NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX
RESEND_API_KEY=re_xxxxx
```

4. **Trigger new deployment:**
   - Go to Deploys → Trigger deploy

---

### Production Deployment (Self-Hosted)

**Create .env.production on server:**
```bash
ssh user@your-server.com

# Create environment file
ssh user@your-server.com << 'EOF'
cat > /var/www/portfolio/.env.production << 'ENVEOF'
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
JWT_SECRET=your_32_char_hex_string
NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX
RESEND_API_KEY=re_xxxxx
ENVEOF

# Restart application
pm2 restart portfolio
EOF
```

---

## Environment-Specific Values

### Development
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
JWT_SECRET=dev_secret_for_testing_do_not_use_in_production
```

### Staging
```bash
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com
NEXT_PUBLIC_API_URL=https://api-staging.your-domain.com
JWT_SECRET=staging_secret_change_for_production
```

### Production
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
JWT_SECRET=your_production_secret_32_char_hex_string
```

---

## Accessing Environment Variables in Code

### Client-Side (Browser - Use NEXT_PUBLIC_ prefix)
```typescript
// Only use NEXT_PUBLIC_ variables in browser
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// These are visible in browser - OK to expose
console.log(appUrl);  // Safe
```

### Server-Side (Only on Server - No prefix)
```typescript
// Use any variable name on server
const jwtSecret = process.env.JWT_SECRET;
const resendKey = process.env.RESEND_API_KEY;

// These are never sent to browser - secure
console.log(jwtSecret);  // ✅ Only visible server-side
```

### TypeScript Type Safety
```typescript
// Create types/env.ts
export interface Env {
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_API_URL: string;
  JWT_SECRET?: string;
  RESEND_API_KEY?: string;
}

// Validate at startup
const env: Env = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
  JWT_SECRET: process.env.JWT_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};

export default env;
```

---

## Security Best Practices

✅ **DO:**
- Keep `.env.local` in `.gitignore`
- Use random, long secrets (32+ characters)
- Rotate secrets regularly in production
- Use different secrets for each environment
- Use `NEXT_PUBLIC_` only for non-sensitive values
- Store secrets in platform dashboard (Vercel/Netlify)

❌ **DON'T:**
- Commit `.env.local` to GitHub
- Hardcode secrets in code
- Use simple passwords
- Reuse production secrets in development
- Share `.env.local` files via email/Slack
- Use same secret across environments

---

## Troubleshooting

### Variables show as `undefined`
```bash
# 1. Verify file exists and is correct
cat .env.local

# 2. Restart dev server (variables loaded at startup)
npm run dev

# 3. Check variable name (case-sensitive)
echo $NEXT_PUBLIC_APP_URL
```

### Production variables not working
```bash
# 1. Verify they're set in platform dashboard
# Vercel: Settings → Environment Variables
# Netlify: Build & Deploy → Environment

# 2. Redeploy after changing variables
# Changes require redeployment to take effect

# 3. Check for typos in variable names
```

### "not a valid hex string" error
```bash
# JWT_SECRET must be valid hex (0-9, a-f only)
# Regenerate using:
# Windows: $([Convert]::ToHexString([RandomNumberGenerator]::GetBytes(32)))
# macOS: openssl rand -hex 32
```

---

## Examples

### Example 1: API Helper
```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function apiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, options);
  return response.json();
}
```

### Example 2: Contact Form
```typescript
// app/api/contact/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, message } = await req.json();
  
  const result = await resend.emails.send({
    from: process.env.NEXT_PUBLIC_APP_URL,
    to: email,
    html: message,
  });
  
  return Response.json(result);
}
```

### Example 3: JWT Authentication
```typescript
// lib/auth.ts
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export function createToken(userId: string) {
  return jwt.sign({ userId }, secret!, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret!);
}
```

---

## Quick Reference

```bash
# Create .env.local from template
cp .env.example .env.local

# Generate new JWT secret (PowerShell)
$([System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)))

# Check if variables are loaded (dev server running)
npm run dev

# Test specific variable
echo $env:NEXT_PUBLIC_APP_URL  # PowerShell
echo $NEXT_PUBLIC_APP_URL       # Bash
```

---

**Next Steps:**
1. ✅ Copy `.env.example` to `.env.local`
2. ✅ Generate secure JWT_SECRET
3. ✅ Add your actual values
4. ✅ Test with `npm run dev`
5. ✅ Set variables in deployment platform dashboard
