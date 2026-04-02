# 🚀 Performance Optimization Quick Reference

## Common Commands

```bash
# Setup & Testing
npm run type-check       # Verify TypeScript
npm run lint             # Code quality check
npm run build            # Build for production
npm run analyze          # Analyze bundle size
npm run perf:lighthouse  # Run Lighthouse audit

# Monitoring
npm run perf:check       # Build + local server
curl http://localhost:3000/api/metrics  # Get metrics

# Development
npm run dev              # Start dev server
npm run format           # Auto-format code
npm run security-check   # Security audit

# Deployment
vercel deploy --prod     # Deploy to Vercel
vercel insights          # View analytics
```

---

## Performance Targets

| Metric | Target | Method |
|--------|--------|--------|
| **Lighthouse** | 90-100 | Lighthouse CLI or DevTools |
| **TTFB** | 50-300ms | Network tab or metrics API |
| **FCP** | <1.5s | Chrome DevTools |
| **LCP** | <2.5s | Chrome DevTools or metrics API |
| **CLS** | <0.1 | Chrome DevTools |
| **Bundle Size** | <200KB | `npm run analyze` |

---

## File Locations & Purpose

```
/lib/web-vitals.ts              Web Vitals tracking & reporting
/lib/cache.ts                   Caching infrastructure
/app/api/metrics/route.ts       Metrics collection API
/next.config.js                 Production optimizations
/app/layout.tsx                 SEO & head optimizations
/app/page.tsx                   Home page performance setup
/components/OptimizedImage.tsx  Image component
```

---

## Using Optimized Image Component

```typescript
import { OptimizedImage, HeroImage, ThumbnailImage } from '@/components/OptimizedImage';

// General use
<OptimizedImage src="/img.jpg" alt="text" width={1200} height={630} />

// Hero (priority load)
<HeroImage src="/hero.jpg" alt="Hero" width={1920} height={1080} />

// Small images
<ThumbnailImage src="/thumb.jpg" alt="Thumb" />
```

---

## Using Caching

```typescript
import { cached, fetchWithCache, invalidateCache } from '@/lib/cache';

// Cache a function call
const data = await cached('key', async () => {
  return fetch('/api/data').then(r => r.json());
}, 3600000); // TTL: 1 hour

// Fetch with automatic caching
const posts = await fetchWithCache('/api/posts', {
  cacheTTL: 1800000,
  cacheKey: 'posts:all'
});

// Clear cache
invalidateCache('posts:all');
```

---

## Using Web Vitals

```typescript
import { measurePerformance } from '@/lib/web-vitals';

// Measure operation duration
const result = await measurePerformance('operation-name', async () => {
  return fetch('/api/data').then(r => r.json());
});

// Console output: ⏱️ operation-name: 523ms
```

---

## Checking Metrics in Production

```bash
# Get all metrics
curl "https://yourdomain.com/api/metrics"

# Filter by metric name
curl "https://yourdomain.com/api/metrics?metric=LCP"

# Filter by page path
curl "https://yourdomain.com/api/metrics?pathFilter=/about"

# Limit results
curl "https://yourdomain.com/api/metrics?limit=50"

# Response includes statistics:
{
  "count": 42,
  "metrics": [...],
  "stats": {
    "LCP": {
      "count": 42,
      "min": 1234,
      "max": 4567,
      "mean": 2345,
      "p50": 2000,
      "p75": 2500,
      "p95": 3500
    }
  }
}
```

---

## Browser Console Web Vitals Output

When you visit the site in development:

```
✅ [FCP] 1234ms
✅ [LCP] 2345ms
✅ [CLS] 0.05
⚠️  [TTFB] 456ms
```

Legend:

- ✅ Green = Good  
- ⚠️ Orange = Needs improvement  
- ❌ Red = Poor

---

## Performance Optimization Checklist

### Before Deployment ✓

- [ ] `npm run type-check` passes
- [ ] `npm run lint` is clean
- [ ] `npm run build` succeeds
- [ ] `npm run analyze` shows acceptable sizes
- [ ] Bundle < 300KB gzipped
- [ ] No console errors

### After Deployment ✓

- [ ] Vercel deployment successful
- [ ] Metrics API working
- [ ] Lighthouse score checked
- [ ] Real-world performance monitored
- [ ] No regressions observed

---

## Environment Variables

Add to `.env.local`:

```bash
# Analytics endpoint (optional)
NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://api.example.com/metrics

# Redis caching (optional)
REDIS_URL=redis://user:pass@host:port
REDIS_TOKEN=your_token

# Metrics API security (production)
METRICS_API_TOKEN=your_secret_token
```

---

## Vercel Deployment

```bash
# One-time setup
npm install -g vercel
vercel login

# Deploy
vercel deploy --prod

# View analytics
vercel insights

# Check logs
vercel logs
```

---

## Database Optimization

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_users_email ON users(email);

-- Composite indexes for common queries
CREATE INDEX idx_posts_user_status 
ON posts(user_id, status) WHERE status = 'published';
```

---

## Troubleshooting

**High TTFB?**

- Check database query performance
- Enable Redis caching
- Deploy to Vercel (edge functions)
- Check network tab for slow requests

**High LCP?**

- Optimize hero image (AVIF/WebP)
- Set `priority={true}` on hero image
- Check for render-blocking CSS/JS
- Defer non-critical scripts

**CLS Issues?**

- Use fixed heights on dynamic content
- Add aspect ratios to images
- Use skeleton loaders
- Avoid surprise content shifts

**Large Bundle?**

- Run `npm run analyze`
- Use dynamic imports
- Remove unused dependencies
- Check for duplicate packages

**Metrics not collecting?**

- Check browser console for errors
- Verify API endpoint accessible
- Check environment variables
- Test: `curl localhost:3000/api/metrics`

---

## Performance Monitoring Tools

- **Vercel Analytics** - Built-in, automatic
- **Chrome DevTools** - Local testing
- **Lighthouse** - Automated audits
- **Metrics API** - Custom tracking  
- **GitHub Actions** - CI/CD monitoring

---

## Key Performance Principles

1. **Defer** non-critical features (requestIdleCallback)
2. **Cache** frequently accessed data
3. **Compress** all assets (gzip + brotli)
4. **Optimize** images (AVIF/WebP)
5. **Monitor** real-world performance
6. **Test** on slow networks
7. **Measure** before optimizing

---

## External Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Tips](https://www.webpagetest.org/)
- [Vercel Docs](https://vercel.com/docs)

---

**Status: Ready to Deploy ✅**
