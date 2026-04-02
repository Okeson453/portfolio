# Portfolio Performance Testing Guide

## Quick Start - Check Your Page Speed

### Option 1: Online Tools (No Installation Needed)
1. **Google PageSpeed Insights** - https://pagespeed.web.dev/
   - Enter your portfolio URL (after deployment)
   - Get scores for Mobile & Desktop (0-100)
   - View Core Web Vitals: LCP, FID, CLS

2. **WebPageTest** - https://www.webpagetest.org/
   - Detailed filmstrip view of page load
   - Waterfall chart showing resource timing
   - Video playback of page rendering

3. **GTmetrix** - https://gtmetrix.com/
   - Lighthouse & Web Vitals scores
   - Performance recommendations
   - Opportunity identification

### Option 2: Local Lighthouse Audit
```powershell
# Install Lighthouse globally
npm install -g lighthouse

# Audit your built portfolio
npm run build
npm run start

# Run audit on localhost:3000
lighthouse http://localhost:3000 --output=html --output-path=./report.html
```

### Option 3: Next.js Built-in Tools
```powershell
# Check bundle analysis
npm run build

# View the .next folder size
Get-ChildItem -Path .\.next -Recurse | Measure-Object -Sum Length
```

## Key Performance Metrics (Core Web Vitals)

| Metric | Good | Needs Work | Poor |
|--------|------|-----------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** (First Input Delay) | < 100ms | 100-300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |

## Current Portfolio Optimizations (Applied)

✅ Dynamic imports for code splitting
✅ Image optimization in next.config.js  
✅ ESLint configuration for performance warnings
✅ TypeScript strict mode enabled
✅ CSS minification

## Next Steps to Optimize

1. **Run Lighthouse** - Get baseline metrics
2. **Check LCP** - Optimize largest element rendering
3. **Minimize JavaScript** - Use code splitting for routes
4. **Optimize Images** - Use Next.js Image component
5. **Enable Caching** - Configure headers.js or vercel.json
6. **Monitor Performance** - Set up Web Vitals tracking

## Testing Commands

```powershell
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Type checking
npx tsc --noEmit
```

## Expected Performance Targets

- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.8s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Lighthouse Score:** 90+

---

**Deployment Performance:** After deploying to Vercel or similar platform, use PageSpeed Insights to get **real user experience** metrics (RUM) which are more accurate than lab testing.
