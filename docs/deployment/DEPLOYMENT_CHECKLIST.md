# Pre-Deployment Checklist

**Use this checklist before deploying to production.**

---

## Phase 1: Code Preparation (Local)

- [ ] All changes committed to GitHub (`git status` shows clean)
- [ ] Latest changes pushed to main branch (`git push origin main`)
- [ ] No uncommitted files with secrets
- [ ] `.gitignore` includes: `.env.local`, `node_modules/`, `.next/`

---

## Phase 2: Environment Setup

- [ ] `.env.local` created with all required variables
- [ ] `.env.example` created and committed (no secrets)
- [ ] All `NEXT_PUBLIC_*` variables set correctly
- [ ] JWT_SECRET generated and securely stored (32+ char hex)
- [ ] Email service credentials configured (if using)
- [ ] API endpoints accessible (test with curl/Postman)

---

## Phase 3: Build & Test Locally

- [ ] `npm ci` completes without errors
- [ ] `npm run build` succeeds without errors/warnings
- [ ] **TypeScript:** `npx tsc --noEmit` passes with 0 errors
- [ ] **ESLint:** `npm run lint` shows no errors
- [ ] `npm run start` works (production build runs locally)
- [ ] Visit http://localhost:3000 - page loads in < 3 seconds
- [ ] All pages accessible (home, about, contact)
- [ ] Navigation works correctly
- [ ] Contact form submits (check email delivery)
- [ ] No console errors (F12 → Console)
- [ ] No console warnings (minimize before production)
- [ ] Dark mode toggle works
- [ ] Images load correctly
- [ ] Mobile responsive (test on mobile device or browser DevTools)
- [ ] All external links open correctly

---

## Phase 4: Performance & SEO

- [ ] Lighthouse audit score ≥ 90 for each page
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] FID (First Input Delay) < 100ms
- [ ] Meta tags present on all pages (title, description)
- [ ] OG (Open Graph) images configured
- [ ] Canonical URLs set correctly
- [ ] Sitemap generated (`/sitemap.xml`)
- [ ] Robots.txt correct (`/robots.txt`)
- [ ] No dead links (run link checker)
- [ ] No broken images

---

## Phase 5: Security

- [ ] HTTPS will be enforced (automatic on Vercel/Netlify)
- [ ] Security headers configured in `next.config.js`
- [ ] No sensitive data in code or comments
- [ ] `.env.local` NOT committed to GitHub
- [ ] API keys/secrets NOT hardcoded
- [ ] CORS properly configured
- [ ] Rate limiting enabled (if applicable)
- [ ] No console.log() statements exposing sensitive info
- [ ] InputvalidationServerValidationCSRF protection enabled

---

## Phase 6: Dependencies

- [ ] `package.json` lists all dependencies
- [ ] No deprecated packages (run `npm audit`)
- [ ] No critical vulnerabilities (`npm audit` shows 0 critical)
- [ ] Missing dependencies installed
- [ ] Unused dependencies removed

---

## Phase 7: Documentation

- [ ] README.md updated with accurate info
- [ ] DEPLOYMENT_START_HERE.md reviewed
- [ ] ENV_SETUP.md reviewed
- [ ] GITHUB_SETUP.md reviewed
- [ ] Comments added to complex code sections
- [ ] API endpoints documented
- [ ] Database schema documented (if applicable)

---

## Phase 8: Deployment Platform Setup

### For Vercel:
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Build settings correct (`npm ci && npm run build`)
- [ ] Output directory set to `.next`
- [ ] Environment variables added to Vercel dashboard
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate provisioned

### For Netlify:
- [ ] Netlify account created
- [ ] GitHub repository connected
- [ ] Build command: `npm ci && npm run build`
- [ ] Publish directory: `.next`
- [ ] Environment variables added to Netlify
- [ ] Custom domain configured (if applicable)
- [ ] Netlify Forms enabled (if contact form)

### For Self-Hosted:
- [ ] VPS provisioned and accessible
- [ ] Node.js installed (version 18+)
- [ ] PM2 installed for process management
- [ ] Nginx configured as reverse proxy
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] Domain DNS records configured
- [ ] Firewall rules set (ports 80, 443 open)

---

## Phase 9: Pre-Deployment Testing

- [ ] Clear browser cache (DevTools → Settings → Network → Disable cache)
- [ ] Test in multiple browsers:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Test on multiple devices:
  - [ ] Desktop (1920x1080)
  - [ ] Tablet (iPad, Android tablet)
  - [ ] Mobile (iPhone, Android phone)
- [ ] Test Internet connection (throttle to 3G in DevTools)
- [ ] Test with extensions disabled
- [ ] Test private/incognito browsing

---

## Phase 10: Deployment

- [ ] Final code review completed
- [ ] All team members notified
- [ ] Backup created (if self-hosted)
- [ ] Deployment window scheduled (avoid peak hours)
- [ ] Team available for quick fixes if needed
- [ ] Monitoring/alerts set up
- [ ] Review deployment logs for errors

---

## Phase 11: Post-Deployment Verification

### Immediate (within 5 min):
- [ ] Visit production URL in browser
- [ ] Check page loads (< 3 seconds)
- [ ] No error messages displayed
- [ ] CSS/styling loaded correctly
- [ ] Images display properly
- [ ] Navigation functional
- [ ] Contact form visible
- [ ] No 404 errors in console

### Testing (within 30 min):
- [ ] Test all pages load
- [ ] Test all links work
- [ ] Test contact form submission
- [ ] Check email delivery (if form sends emails)
- [ ] Verify environment variables working
- [ ] Check API connectivity
- [ ] Test dark mode
- [ ] Test mobile responsiveness

### Monitoring (24 hours):
- [ ] Monitor for errors in dashboards (Vercel/Netlify/Sentry)
- [ ] Check Google Analytics recording data
- [ ] Monitor error tracking (if enabled)
- [ ] Check uptime monitoring alerts
- [ ] Review any error logs
- [ ] Monitor performance metrics

### SEO Verification:
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify robots.txt accessible
- [ ] Check meta tags in browser DevTools
- [ ] Validate structured data https://schema.org/validator

---

## Phase 12: Post-Deployment Optimization

- [ ] Enable browser caching headers
- [ ] Enable gzip compression
- [ ] Setup CDN (if using self-hosted)
- [ ] Monitor Core Web Vitals daily
- [ ] Setup automatic deployments on git push
- [ ] Setup uptime monitoring alerts
- [ ] Setup error tracking alerts
- [ ] Schedule performance reviews (weekly for 1st month)

---

## Emergency Rollback Plan

If something breaks after deployment:

```bash
# Vercel: Automatic rollback available in dashboard
# → Deployments → Previous version → Promote to Production

# Netlify: Automatic roll back available in dashboard
# → Deploys → Previous deploys → Set as published

# Self-Hosted: Revert to previous commit
git revert <commit-hash>
npm run build
npm run start
pm2 restart portfolio
```

**Contact channels if issues arise:**
- GitHub Issues: Create issue with `[URGENT] Production Issue`
- Email: Send to team lead
- Slack: Post in #incidents channel

---

## Sign-Off

Once all items checked:

**Developer:** ___________________ Date: ___________

**QA/Reviewer:** _________________ Date: ___________

**Deployment Approved:** ☐ Yes ☐ No

**Notes:**
```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

---

## Quick Checklist (TL;DR)

```bash
# 1. Code ready?
npm run build && npm run lint && npx tsc --noEmit

# 2. Local test?
npm run start
# Visit http://localhost:3000

# 3. Git pushed?
git status
git push origin main

# 4. Env vars set?
# Check .env.local, then platform dashboard

# 5. Lighthouse good?
# 90+ score for all pages

# 6. Deploy!
# Vercel/Netlify: Automatic from git push
# Self-hosted: git pull && npm run build && pm2 restart portfolio

# 7. Verify!
# Visit production URL, check console, test forms
```

---

**Next Step:** [DEPLOYMENT_START_HERE.md](./DEPLOYMENT_START_HERE.md)
