# Performance Baselines

**Last measured:** April 2, 2026

---

## Development Environment

| Metric | Baseline | Alert Threshold | Status |
|--------|----------|-----------------|--------|
| `npm run dev` cold start | 4–5s | >8s | ✅ |
| HMR (component edit) | ~120ms | >400ms | ✅ |
| HMR (CSS edit) | ~80ms | >200ms | ✅ |
| `npm run type-check` | 6–8s | >15s | ✅ |
| `npm run test:fast` | 4–6s | >15s | ✅ |
| `npm run build` (dev) | 45–60s | >120s | ✅ |

---

## Production (Lighthouse — Desktop)

| Metric | Baseline | Target | Alert |
|--------|----------|--------|-------|
| **Performance** | 90+ | 95+ | <85 |
| **Accessibility** | 95+ | 98+ | <90 |
| **SEO** | 95+ | 98+ | <90 |
| **Best Practices** | 90+ | 95+ | <85 |
| **First Contentful Paint** | 1.2s | <1.0s | >2.0s |
| **Largest Contentful Paint** | 2.1s | <2.5s | >4.0s |
| **Cumulative Layout Shift** | 0.08 | <0.1 | >0.25 |
| **Total Blocking Time** | <300ms | <200ms | >600ms |

---

## Bundle Size

| Bundle | Baseline | Alert Threshold |
|--------|----------|-----------------|
| First Load JS (shared) | ~85KB gzip | >120KB |
| Largest page | ~180KB gzip | >250KB |
| CSS | ~45KB gzip | >80KB |
| Critical Path | <200KB | >300KB |

---

## How to Measure

### Local Development Performance

```bash
# Measure TypeScript compilation time
time npm run type-check

# Measure cold build
rm -rf .next && time npm run build

# Measure test suite
time npm run test:fast

# Measure HMR speed (save a component file)
npm run dev:safe
# -> look at terminal for HMR time feedback
```

### Lighthouse Audit

```bash
# Run local Lighthouse audit
npm start &  # Background
npx lhci collect --config=lighthouserc.json

# Run in CI (done automatically in GitHub Actions)
```

### Bundle Analysis

```bash
# Analyze bundle composition
ANALYZE=true npm run build

# View the interactive analysis (opens browser)
# Breakdown available in ./.next/analyze/
```

### Continuous Monitoring

- **GitHub Actions**: Lighthouse CI runs on every PR
- **Vercel Analytics**: Production performance tracked automatically
- **Local baseline check**: Run `npm run perf:audit` before major changes

---

## Performance Tips

### For Faster Development

1. **Use `npm run dev:safe` by default**
   - Enables TypeScript watch alongside HMR
   - Catch errors immediately, not at CI time

2. **Skip coverage in dev**
   - Use `npm run test:fast` (no coverage)
   - Run `npm run test:ci` only before commit

3. **Cache aggressively**
   - `.jest-cache/` is auto-cached
   - `node_modules/.cache/` for webpack
   - Turbo caches in `.turbo/`

### For Smaller Bundles

1. **Tree-shakeable imports only**
   ```typescript
   // ✅ Good — tree-shakeable
   import { Button } from '@radix-ui/react-button';
   
   // ❌ Bad — includes all Radix components
   import * as RadixUI from '@radix-ui';
   ```

2. **Lazy-load heavy components**
   ```typescript
   const Chart = dynamic(() => import('@/components/Chart'), {
     loading: () => <Skeleton />,
   });
   ```

3. **Monitor dynamic imports**
   - Charts, PDF generators, heavy editors should be lazy-loaded
   - Check `ANALYZE=true npm run build` output

---

## Regression Detection

If metrics exceed alert thresholds:

1. **Check recent changes**
   ```bash
   git log --oneline -10
   ```

2. **Profile the build**
   ```bash
   ANALYZE=true npm run build
   # Look at .next/analyze/ in browser
   ```

3. **Check dependencies**
   ```bash
   npm ls | grep -i <suspected-package>
   ```

4. **Compare before/after**
   ```bash
   git stash
   npm run build  # measure fresh
   git stash pop  # restore your changes
   ```

---

## CI/CD Performance

- Type checking, linting, and tests run in **parallel** (not sequential)
- Jest cache is persisted between runs
- Turbo cache is persisted for Next.js builds
- Lighthouse CI runs on PR previews automatically
- Production deployments skip non-essential checks (pre-built)

---

## Future Improvements

- [ ] Add Core Web Vitals monitoring (Vercel Analytics)
- [ ] Implement performance budgets in CI
- [ ] Setup regression alerts on thresholds
- [ ] Profile with DevTools flame graphs
- [ ] Optimize critical CSS path
- [ ] Evaluate ISR caching strategy

---

*For questions about performance, see [DEVELOPMENT.md](./DEVELOPMENT.md) or run `npm run verify:local`*
