# 🚀 Deployment Guide - SecureStack Portfolio

## Pre-Deployment (30 min)

```bash
# 1. Verify everything builds
npm run build
# ✅ Should succeed with no errors

# 2. Type check
npm run type-check  
# ✅ Should show only test file errors (ignore these)

# 3. Run performance audit
npm run perf:audit
# ✅ Check bundle size is acceptable

# 4. Start locally and test
npm run start
# Then open: http://localhost:3000
# - Click around
# - Test forms
# - Verify images load
```

## Lighthouse Test (15 min)

```
1. Open http://localhost:3000 in Chrome
2. Press F12 (DevTools)
3. Go to Lighthouse tab
4. Select "Mobile" (more realistic)
5. Click "Analyze page load"
6. Check score:
   - ✅ 95+ = Perfect (deploy!)
   - ⚠️  80-94 = Good (monitor after deploy)
   - ❌ <80 = Needs work (check PERFORMANCE.md)
```

## Deploy to Vercel (60 sec)

```bash
# 1. Ensure all changes are committed
git add -A
git commit -m "perf: enable Next.js 14+ optimizations & Web Vitals tracking"

# 2. Push to GitHub
git push origin main

# 3. Wait for Vercel auto-deploy
# Vercel watches your repo and deploys automatically
# Check: https://vercel.com/your-account/projects

# 4. Visit deployed URL
# Should be extremely fast (<1s)
```

## Post-Deployment Verification (24 hours)

### Hour 1

```
1. Visit your deployed URL
2. Check page loads in <1s
3. DevTools → Network → Check:
   - CSS: <50KB
   - JS: <150KB  
   - Total: <250KB
4. DevTools → Performance → Record load
   - LCP should be <2.5s
   - No layout shifts
```

### Hours 2-24  

```
1. Vercel Dashboard → Speed Insights (monitor)
2. Wait for real user metrics to populate
3. Check after 24 hours:
   - Real LCP from users
   - FID metrics
   - CLS scores
4. Monitor daily for first week
```

## Performance Verification Checklist

### ✅ Real User Metrics (Vercel Dashboard)

After 24-48 hours, check Speed Insights:

- [ ] LCP: See green (good) values
- [ ] FID: Sub-100ms
- [ ] CLS: <0.1 (no jumpy layouts)
- [ ] No regression from baseline

### ✅ Global Performance

Test from different regions:

- [ ] North America: <800ms
- [ ] Europe: <1s
- [ ] Asia: <1.2s
- [ ] Africa: <1.5s

### ✅ Device Performance

- [ ] Desktop (fast connection): <500ms
- [ ] Mobile 4G: <2s
- [ ] Mobile 3G: <4s

### ✅ Browser DevTools

```
Performance tab:
✓ LCP < 2.5s
✓ FID < 100ms
✓ CLS < 0.1
✓ TTL > 95

Network tab:
✓ No failed requests
✓ Images: <30KB each
✓ JS: One main bundle
✓ CSS: Minimal
```

## If Performance is Slow After Deploy

### Diagnose

1. Check Vercel logs for errors
2. Compare with local performance
3. Check real metrics in Speed Insights
4. Verify CDN cache is populated

### Quick Fixes (in order of impact)

| Issue | Solution | Impact |
|-------|----------|--------|
| No CDN cache | Wait 24h for Vercel cache | 30-40% |
| Hero image slow | Add `priority` or compress | 20-30% |
| Layout shift | Add width/height to images | 10-20% |
| Slow JS | Check DevTools Performance tab | 5-15% |

## Monitoring Strategy

### Daily (First Week)

```
1. Check Vercel Speed Insights
2. Look for anomalies
3. Alert on regressions
4. Monitor error logs
```

### Weekly (Ongoing)

```
1. Review Web Vitals trend
2. Check for performance regressions  
3. Identify slow pages
4. Note optimization opportunities
```

### Monthly

```
1. Full Lighthouse audit
2. Bundle analysis
3. Update dependencies
4. Optimize based on usage patterns
```

## Troubleshooting

### "Build failed on Vercel"

```
1. Check Vercel build logs
2. Ensure env variables are set
3. Verify all packages installed locally
4. Run: npm run build locally  
5. Fix errors and retry push
```

### "Site slow in production but fast locally"

```
1. Check DevTools → Network → Throttle to "Slow 4G"
2. Compare metrics
3. Check image loading in Network tab
4. Verify caching headers are applied
```

### "Lighthouse still shows 80/100"

```
Follow this priority order:
1. Hero image: Add priority={true}
2. Compress images: Use Squoosh.app
3. Remove unused CSS: Check DevTools Coverage
4. Check Core Web Vitals: See PERFORMANCE.md
```

## Success Criteria

### ✅ You're Done When

- [ ] Vercel build: <2 minutes
- [ ] First Byte: <600ms
- [ ] LCP: <2.5s  
- [ ] FID: <100ms
- [ ] CLS: <0.1
- [ ] Lighthouse: 95+/100
- [ ] No errors in Vercel logs
- [ ] Speed Insights shows green metrics

---

## Quick Reference

### Useful Links

- Deployed site: `https://your-domain.vercel.app`
- Vercel Dashboard: `https://vercel.com`
- Speed Insights: `https://[vercel-project]/speed-insights`
- Monitor: `https://vercel.com/analytics`

### Helpful Commands

```bash
npm run build           # Build locally
npm run start           # Start server
npm run analyze         # Bundle analysis
npm run type-check      # Type check
npm run lint            # Code quality

# Vercel CLI (optional)
npm install -g vercel
vercel --version
vercel login
vercel deploy
```

### If Something Goes Wrong

1. Check Vercel logs
2. Look at `PERFORMANCE.md` for details
3. Review `PERFORMANCE_CHECKLIST.md`
4. Check DevTools Performance tab
5. Run local lighthouse audit

---

## Timeline Summary

| Phase | Duration | Action |
|-------|----------|--------|
| **Prepare** | 30 min | Local build & test |
| **Deploy** | 1 min | `git push origin main` |
| **Verify** | 2-4 hours | Test globally, check metrics |
| **Monitor** | 24-48 hours | Wait for real user data |
| **Optimize** | Ongoing | Monitor & refine |

---

**You're ready!** 🎉

Follow this guide in order, and you'll have a blazing-fast portfolio that impresses recruiters.

**Questions?** Check PERFORMANCE_SETUP.md for detailed setup instructions.
