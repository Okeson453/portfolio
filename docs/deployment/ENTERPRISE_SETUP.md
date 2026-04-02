# SecureStack Portfolio - Enterprise Frontend Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/pnpm/yarn
- Git
- Environment variables configured

### Installation

```bash
# Clone repository
git clone <repo-url>
cd portfolio

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure environment variables (see below)
# Edit .env.local with your values

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

---

## 🔧 Environment Variables

### Required for Core Features
```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
DATABASE_URL=postgresql://...
JWT_SECRET=<generate: openssl rand -hex 32>
```

### Security & Monitoring
```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/project-id
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
```

### File Storage (Optional)
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your-bucket-name
```

### Feature Flags & Admin
```bash
ADMIN_API_TOKEN_SECRET=your-admin-token-secret
NEXT_PUBLIC_FEATURE_FLAGS_ENABLED=true
```

See `.env.example` for complete list of variables.

---

## 📦 Features Implemented

### ✅ 12 Enterprise Patterns

1. **Infinite Scroll** - Loads content as user scrolls with cursor-based pagination
2. **Debounced Search** - 300ms debounce on search input with URL sync
3. **Loading Skeletons** - Animated shimmer placeholders matching layouts
4. **Toast Notifications** - Stackable, accessible notifications via `sonner`
5. **Modal Dialogs** - Focus-trapped, scroll-locked modals with animations
6. **Drag & Drop** - Touch-friendly reordering with `@dnd-kit`
7. **Virtual Scrolling** - High-performance lists with `react-virtuoso`
8. **Command Palette** - Cmd+K global search/navigation via `cmdk`
9. **Advanced Forms** - Multi-step with auto-save drafts using `react-hook-form`
10. **Offline Support** - PWA with service worker caching strategies
11. **Real-time Updates** - WebSocket support for live data
12. **Feature Flags** - Dynamic toggles without redeploy + A/B testing

### 🔒 Security Enforced

- **XSS Prevention**: DOMPurify sanitization for user content
- **CSP Headers**: Restrictive Content Security Policy
- **CSRF Protection**: Token-based protection on forms
- **Rate Limiting**: API rate limits via Upstash
- **JWT Security**: HttpOnly cookies, 7-day rotation
- **Input Validation**: Zod schema validation on all forms

### ⚡ Performance

- **Lighthouse Score**: Target ≥95 (audit on every commit)
- **Bundle Size**: <200KB gzipped initial JS
- **Image Optimization**: WebP/AVIF with responsive sizes
- **Code Splitting**: Automatic via Next.js
- **Caching**: Aggressive cache headers for static assets

### ♿ Accessibility

- **WCAG 2.2 AAA**: Full Keyboard navigation
- **Focus Management**: Focus trap in modals
- **ARIA Labels**: Semantic HTML / ARIA attributes
- **Screen Reader**: Tested with browser readers
- **Color Contrast**: 7:1 ratio on text

### 📊 Monitoring & Analytics

- **Error Tracking**: Sentry for error collection + alerting
- **User Analytics**: PostHog for custom events + feature flags
- **Performance**: Web Vitals collection + dashboard
- **Health Checks**: `/api/health` endpoint for monitoring

---

## 🧪 Testing

### Unit & Integration Tests

```bash
# Run Jest tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run Playwright tests
npm run e2e

# Headed mode (see browser)
npm run e2e:headed

# Debug mode
npm run e2e:debug

# UI mode
npm run e2e:ui
```

### Lighthouse

```bash
# Run Lighthouse CI on build
npm run build && npm run perf:lighthouse
```

---

## 🚢 Deployment

### Environment Setup

1. **Vercel** (Recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

2. **Docker** (Self-hosted)
```bash
# Build image
docker build -t portfolio .

# Run container
docker run -p 3000:3000 portfolio
```

### Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] E2E tests pass: `npm run e2e`
- [ ] Lighthouse ≥95: `npm run perf:lighthouse`
- [ ] Security audit passes: `npm audit`

### CI/CD Pipeline

GitHub Actions workflow included in `.github/workflows/`:

- **Lint**: ESLint + Prettier
- **Type Check**: TypeScript compilation
- **Test**: Jest unit + integration tests
- **E2E**: Playwright tests
- **Build**: Next.js build verification
- **Lighthouse**: Performance audit
- **Deploy**: Deploy to Vercel/Docker

---

## 📚 API Routes

### Blog
- `GET /api/blog/posts` - Paginated blog posts (infinite scroll)
- `GET /api/blog/search?q=...` - Search blog posts (debounced)

### Configuration
- `GET /api/feature-flags` - Get all feature flags
- `GET /api/feature-flags?flag=...` - Get specific flag
- `POST /api/feature-flags` - Update feature flag (admin)

### Monitoring
- `GET /api/health` - Health check

---

## 🎯 Component Usage Examples

### Infinite Scroll
```tsx
import { InfiniteScrollBlogList } from '@/components/InfiniteScrollBlogList';

export default function Blog() {
  return <InfiniteScrollBlogList limit={10} />;
}
```

### Debounced Search
```tsx
import { BlogSearchComponent } from '@/components/BlogSearchComponent';

export default function SearchPage() {
  return <BlogSearchComponent />;
}
```

### Command Palette (Built-in)
- Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)

### Modal Dialog
```tsx
import { Modal } from '@/components/ui/Modal';
import { useModal } from '@/hooks';

const { isOpen, open, close } = useModal();

return (
  <>
    <button onClick={open}>Open Modal</button>
    <Modal isOpen={isOpen} onClose={close} title="Title">
      Content here
    </Modal>
  </>
);
```

### Stepper (Multi-step Forms)
```tsx
import { Stepper } from '@/components/ui/Stepper';

<Stepper
  steps={[
    { id: '1', title: 'Basic Info' },
    { id: '2', title: 'Avatar' },
    { id: '3', title: 'Confirm' },
  ]}
  currentStep={0}
/>
```

### File Upload
```tsx
import { FileUploader } from '@/components/ui/FileUploader';

<FileUploader
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  onFileSelect={(file, preview) => console.log(file)}
/>
```

---

## 🔍 Debugging

### Enable Debug Logging

```bash
# Enable debug for various services
DEBUG=next:* npm run dev
DEBUG=socket.io-client npm run dev
```

### View Service Worker

1. Open Chrome DevTools
2. Go to Application > Service Workers
3. Check registration status and inspect cache

### PostHog Events

Visit `https://posthog.com` dashboard to view:
- Custom events
- Feature flag exposure
- User segments
- Session recordings

### Sentry Errors

Visit `https://sentry.io` dashboard to view:
- Error tracking
- Performance traces
- Release health
- Alerts

---

## 📈 Performance Optimization

### Metrics to Monitor

- **Largest Contentful Paint (LCP)**: Target <2.5s
- **Cumulative Layout Shift (CLS)**: Target <0.1
- **First Input Delay (FID)**: Target <100ms
- **Time to Interactive (TTI)**: Target <3.8s

### Optimization Strategies

1. **Image Optimization**
   - Use Next.js `<Image>`
   - Provide `sizes` prop
   - Use WebP/AVIF formats

2. **Code Splitting**
   - Dynamic imports for large components
   - Route-based code splitting
   - Automatic by Next.js 15

3. **Caching**
   - Service Worker for offline
   - HTTP caching headers
   - Browser caching

4. **Bundle Analysis**
   ```bash
   ANALYZE=true npm run build
   ```

---

## 🛠️ Troubleshooting

### Service Worker Not Registering

```bash
# Clear cache
rm -rf .next

# Rebuild
npm run build

# Check Network tab in DevTools for sw.js
```

### Feature Flags Not Loading

```bash
# Check LocalStorage in console
localStorage.getItem('feature-flags-cache')

# Verify API endpoint
curl http://localhost:3000/api/feature-flags
```

### Infinite Scroll Not Working

- Check `useInfiniteScroll` hook is mounted
- Verify sentinel ref attached to DOM element
- Check browser console for API errors
- Verify `/api/blog/posts` returns `pagination.hasMore`

---

## 📞 Support & Documentation

- **React Query**: https://tanstack.com/query/docs
- **Next.js**: https://nextjs.org/docs
- **Radix UI**: https://radix-ui.com/primitives
- **Sentry**: https://docs.sentry.io
- **PostHog**: https://posthog.com/docs

---

## 📝 License

See LICENSE file.

---

**Last Updated**: March 31, 2026  
**Version**: 1.0.0 - Enterprise Edition
