# Deployment to Vercel

This portfolio is optimized for deployment on Vercel.

## Quick Start

### 1. Connect Your GitHub Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository (`portfolio`)
4. Vercel will auto-detect Next.js and configure settings
5. Click **"Deploy"**

Vercel will build and deploy automatically. You'll get a live URL immediately.

### 2. Configure Environment Variables

After your first deploy, go to:
**Project Settings → Environment Variables**

Add all required variables from [docs/ENVIRONMENT.md](./ENVIRONMENT.md):

```
NEXT_PUBLIC_APP_URL = https://okeson.dev
JWT_SECRET = [generate with: openssl rand -hex 32]
DATABASE_URL = [your PostgreSQL connection string]
RESEND_API_KEY = [from resend.com]
ALGOLIA_APP_ID = [from algolia.com]
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY = [from algolia.com]
ALGOLIA_ADMIN_KEY = [from algolia.com]
UPSTASH_REDIS_REST_URL = [from upstash.com]
UPSTASH_REDIS_REST_TOKEN = [from upstash.com]
SENTRY_AUTH_TOKEN = [from sentry.io]
```

### 3. Configure Custom Domain (Optional)

1. Go to **Project Settings → Domains**
2. Click **"Add Domain"**
3. Enter your domain: `okeson.dev`
4. Follow DNS setup instructions from your domain provider

### 4. Run Tests & Verify

```bash
npm run type-check
npm run lint
npm run test:ci
npm run build
```

## Continuous Deployment

Every push to `main` branch automatically triggers a deployment:

1. GitHub Actions CI runs (tests, lint, type check, build)
2. If all checks pass, Vercel deploys
3. If checks fail, deployment is blocked

Pull requests get automatic preview deployments.

## Performance Monitoring

After deployment, import `vercel.json` to enable Lighthouse CI:

1. Go to **Project Settings → Integrations**
2. Search for **"Lighthouse CI"**
3. Connect your Lighthouse CI account
4. PR comments will show performance scores

## Rollback

If you need to revert to a previous deployment:

1. Go to **Deployments**
2. Find the deployment you want to restore
3. Click **"Promote to Production"**

## Monitoring

### Sentry Error Tracking

Errors are automatically sent to Sentry. Go to [sentry.io](https://sentry.io) to view:
- Exception tracking
- Performance monitoring
- Release tracking

### Upstash Redis

Monitor rate limiting and caching at [upstash.com](https://upstash.com)

## Troubleshooting

### Build Fails on Vercel

Check build logs in Vercel dashboard → **Deployments → [Your Deploy] → Logs**

Common issues:
- Missing environment variables (add to Vercel dashboard)
- TypeScript errors (run `npm run type-check` locally)
- Missing dependencies (run `npm install` and commit package-lock.json)

### Performance Issues

Run a local Lighthouse audit:

```bash
npm run build
npm run start
npm run lighthouse
```

Compare results with production. Check:
- Bundle size (use `ANALYZE=true npm run build`)
- Image optimization
- Database query performance (check Sentry)
