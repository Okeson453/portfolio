# Enterprise Remediation Roadmap — Execution Tracker

**Current Score**: 6.2/10 → **Target**: 9.8/10  
**Total Tasks**: 27 | **Total Effort**: ~14 hours  
**Current Lighthouse**: 78 (desktop) → **Target**: 99+

---

## ✅ PHASE 1: CRITICAL — BLOCKING PRODUCTION (~5.5h) [COMPLETE]

Gates all Phase 2/3 work. Must be completed first.

- [x] **[T1]** Harden CSP — remove unsafe-inline & unsafe-eval (30 min)
- [x] **[T2]** Replace regex sanitization with DOMPurify (20 min)
- [x] **[T3]** Implement real Upstash Redis rate limiting (45 min)
- [x] **[T4]** Create app/error.tsx with Sentry integration (30 min)
- [x] **[T5]** Create app/not-found.tsx with metadata (15 min)
- [x] **[T6]** Add startup environment variable validation (20 min)
- [x] **[T7]** Fix dangerouslySetInnerHTML & move inline styles (25 min)
- [x] **[T8]** Add priority prop to hero LCP image (10 min)

### Phase 1 Success Criteria
- [x] No CSP violations in browser console (no unsafe-inline, unsafe-eval)
- [x] Mock rate limiter replaced with real Upstash Redis SDK
- [x] Error page renders on server crashes (error.tsx + global-error.tsx)
- [x] Not-found page displays for 404s with metadata
- [x] Environment validation prevents startup without required vars
- [x] LoadingSpinner animations moved to CSS module (no inline styles)

---

## ⏳ PHASE 2: HIGH PRIORITY — PERFORMANCE & QUALITY (~5h)

Pushes Lighthouse from 85 to 95+, coverage from 45% to 80%.

- [ ] **[T9]** Add loading.tsx skeleton screens for all routes (30 min)
- [ ] **[T10]** Upgrade API error handling with Sentry + Prisma distinctions (25 min)
- [ ] **[T11]** Install @next/bundle-analyzer and add to CI (20 min)
- [ ] **[T12]** Fix keyboard accessibility on all interactive elements (45 min)
- [ ] **[T13]** Add cache-control headers in middleware for static assets (20 min)
- [ ] **[T14]** Add login-specific rate limiter in middleware.ts (30 min)
- [ ] **[T15]** Add API route unit tests (contact, comments, auth) (2–3 hours)
- [ ] **[T16]** Add image dimensions to all Next.js Image usages (20 min)
- [ ] **[T17]** Enforce JWT_SECRET length validation at runtime (15 min)

### Phase 2 Success Criteria
- [ ] Skeleton screens appear instantly on navigation
- [ ] API errors are structured and logged to Sentry
- [ ] Bundle analysis report shows in GitHub PR
- [ ] Footer easter egg is keyboard navigable
- [ ] Cache headers visible in browser dev tools
- [ ] Login attempts throttled with CAPTCHA fallback
- [ ] API test coverage ≥80%
- [ ] CLS reduced from 0.12 to ≤0.1
- [ ] Lighthouse score ≥95 on desktop

---

## 🚀 PHASE 3: POLISH & SCALE — ENTERPRISE GRADE (~4h)

Enterprise readiness, monitoring, load testing, production hardening.

- [ ] **[T18]** Expand E2E test coverage for auth flow (1.5 hours)
- [ ] **[T19]** Create lib/monitoring/logger.ts structured logger (35 min)
- [ ] **[T20]** Reorganize App Router structure with route groups (1 hour)
- [ ] **[T21]** Split settings layout into server + client components (25 min)
- [ ] **[T22]** Tree-shake unused Radix UI components (30 min)
- [ ] **[T23]** Add bundle size regression gate to GitHub Actions (20 min)
- [ ] **[T24]** Add refresh token rotation (1 hour)
- [ ] **[T25]** Run OWASP ZAP security scan against staging (1 hour)
- [ ] **[T26]** Add stale-while-revalidate for all API responses (30 min)
- [ ] **[T27]** Load test: 50–100 concurrent users with k6 (1 hour)

### Phase 3 Success Criteria
- [ ] All RBAC paths covered by E2E tests
- [ ] Logs appear in Sentry dashboard with breadcrumbs + request IDs
- [ ] Route groups eliminate @/components/* ambiguity
- [ ] Settings page loads in server component mode
- [ ] Bundle size reduced by 3-5KB via tree-shaking
- [ ] CI blocks PRs that exceed bundle budget
- [ ] Refresh tokens rotate silently every request
- [ ] OWASP scan finds 0 MEDIUM+ findings
- [ ] k6 test passes: p95 ≤500ms, error rate <1%

---

## PILLAR SCORE PROGRESSION

| Pillar | Before | After | Change |
|--------|--------|-------|--------|
| Security | 5.0 | 9.8 | +4.8 |
| Reliability | 6.0 | 9.8 | +3.8 |
| Performance | 7.0 | 9.8 | +2.8 |
| Accessibility | 7.5 | 9.8 | +2.3 |
| Testing | 5.5 | 9.8 | +4.3 |
| TypeScript | 9.5 | 9.9 | +0.4 |

---

## IMPLEMENTATION GUIDE

### Critical Dependencies Already Installed ✓
- `@upstash/ratelimit` + `@upstash/redis`
- `@sentry/nextjs`
- `dompurify` + `@types/dompurify`
- `zod` (for validation)

### Required Environment Variables
Set in `.env.local` and Vercel:
```bash
UPSTASH_REDIS_REST_URL=<your-redis-url>
UPSTASH_REDIS_REST_TOKEN=<your-redis-token>
SENTRY_AUTH_TOKEN=<your-sentry-token>
JWT_SECRET=<min-32-chars-random-secret>
```

### Git Workflow
1. Create feature branch per phase: `feat/phase-1-security`, `feat/phase-2-perf`, etc.
2. Implement 2-4 tasks per commit
3. Run full test suite before merge
4. Get `npm run test:coverage` to ≥80%

### Deployment Checklist
- [ ] All Phase 1 complete + merged to main
- [ ] Lighthouse CI passing ≥95
- [ ] Zero OWASP findings
- [ ] k6 load test passing
- [ ] All env vars set in production
- [ ] Feature flags enabled for rollout

---

## Q&A REFERENCE

**Q: Why is Phase 1 blocking?**  
A: CSP with `unsafe-eval` open, no rate limiting, and missing error boundaries are attack surface + reliability risks. These must be fixed before performance work.

**Q: Estimated timeline?**  
A: ~14 hours total. Phase 1 can be done in 1-2 days, Phase 2 over a week, Phase 3 over another week.

**Q: Will this affect user-facing features?**  
A: No. All changes are infrastructure/security. Only impact is improved performance + reliability.

**Q: What if I get stuck on T15 (API tests)?**  
A: It's the most time-intensive task. Start with happy path tests (valid input → 200), then error cases. Use Jest snapshot testing to speed up coverage.

---

**Last Updated**: 2026-04-02  
**Owner**: okeson
