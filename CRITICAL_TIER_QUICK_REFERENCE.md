# CRITICAL TIER QUICK REFERENCE GUIDE

**Status:** ✅ ALL ITEMS IMPLEMENTED  
**Last Verified:** April 3, 2026

---

## 🎯 At a Glance

### Fully Implemented Categories (44/44 items):
- ✅ **Schema & SEO** (6 items) - JSON-LD, OG images
- ✅ **Accessibility** (16 items) - Focus, keyboard, WCAG, dark mode
- ✅ **Form & Errors** (12 items) - Validation, display, success
- ✅ **Rate Limiting** (6 items) - Config + tests
- ✅ **OG Images** (4 items) - Dynamic generation

---

## 📁 Key Files

| Feature | File | Lines |
|---------|------|-------|
| Schemas | `lib/schema.ts` | 1-300 |
| Validation | `lib/formValidation.ts` | 1-70 |
| Rate Limiting | `lib/security/rateLimiter.ts` | 1-100 |
| Rate Tests | `lib/security/rateLimiter.test.ts` | 1-120 |
| Global CSS | `app/globals.css` | 1-300 |
| Button Component | `components/ui/Button.tsx` | 1-100 |
| Contact Form | `components/ContactForm.tsx` | 1-400 |
| Navigation | `app/components/Navigation.tsx` | 1-300 |
| Contact API | `app/api/contact/route.ts` | 1-50 |
| OG Images API | `app/api/og/route.tsx` | 1-150 |
| Layout | `app/layout.tsx` | 1-250 |

---

## 🔍 Quick Verification

### Check Schemas
```bash
# Verify Person schema in layout
grep -n "generatePersonSchema" app/layout.tsx

# Verify Website schema in layout
grep -n "generateWebsiteSchema" app/layout.tsx

# View all schema generators
cat lib/schema.ts | grep "^export function"
```

### Check Accessibility
```bash
# Find focus-visible styles
grep -n "focus-visible" app/globals.css

# Find keyboard handlers
grep -n "handleDropdownKeyDown\|handleMenuKeyDown" app/components/Navigation.tsx

# Find aria attributes
grep -n "aria-" components/ContactForm.tsx | head -20
```

### Check Validation
```bash
# Verify Zod validation
grep -n "validateForm\|validateField" lib/formValidation.ts

# Check form error handling
grep -n "handleBlur\|handleChange" components/ContactForm.tsx
```

### Check Rate Limiting
```bash
# View rate limit config
grep -A 10 "RATE_LIMIT_CONFIG" lib/security/rateLimiter.ts

# Run rate limit tests
node lib/security/rateLimiter.test.ts
```

---

## 🧪 Testing Commands

```bash
# All tests
npm test -- --coverage

# Specific test file
npm test -- rateLimiter.test.ts

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Lighthouse audit
npm run lighthouse

# Verify all fixes
bash verify-enterprise-fixes.sh
```

---

## 🚀 Deployment Workflow

1. **Pre-Flight Checks**
   ```bash
   npm run type-check && npm run lint && npm test -- --coverage
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Lighthouse Check**
   ```bash
   npm run lighthouse
   ```

4. **Verify All Fixes**
   ```bash
   bash verify-enterprise-fixes.sh
   ```

5. **Deploy**
   ```bash
   git add . && git commit -m "feat: enterprise-grade critical tier complete"
   git push origin main
   ```

---

## 🔒 Security Checklist

- [x] Rate limits configured: login 5/10min, register 3/1hr, contact 3/5min
- [x] Fail-closed behavior on Redis unavailable
- [x] Form input validated with Zod
- [x] Error messages sanitized (no info leakage)
- [x] HTTPS enforced (configured in Next.js)
- [x] CSP headers configured (if applicable)

---

## ♿ Accessibility Checklist

- [x] Focus visible on all interactive elements
- [x] Dark mode contrast: 4.5:1 minimum
- [x] Keyboard navigation: Tab, Arrow, Enter, Escape
- [x] Form labels properly associated
- [x] Error messages have role="alert"
- [x] Status regions have aria-live="polite"
- [x] Touch targets: minimum 44×44px

---

## 📊 SEO Checklist

- [x] Person schema injected
- [x] Website schema injected
- [x] Article schema ready for blog posts
- [x] Project schema ready for portfolio
- [x] OG images at `/api/og` endpoint
- [x] Metadata configured in layout.tsx
- [x] Canonical URLs configured
- [x] Robots.txt configured
- [x] Sitemap.xml configured

---

## 🎨 Component Usage Examples

### Using Schemas in Components

**Blog Post Page:**
```tsx
import { SchemaScript, generateArticleSchema } from '@/lib/schema';

export default function BlogPost({ post }) {
  return (
    <>
      <SchemaScript schema={generateArticleSchema(post)} />
      <article>{/* content */}</article>
    </>
  );
}
```

**Project Page:**
```tsx
import { SchemaScript, generateProjectSchema } from '@/lib/schema';

export default function ProjectPage({ project }) {
  return (
    <>
      <SchemaScript schema={generateProjectSchema(project)} />
      <section>{/* content */}</section>
    </>
  );
}
```

### Using OG Images

**Dynamic OG Image URL:**
```tsx
const ogImageUrl = `/api/og?title=${encodeURIComponent(title)}&type=article&tags=${encodeURIComponent(tags.join(','))}`;
```

### Using Form Validation

**Validate on Blur:**
```tsx
import { validateFormField } from '@/lib/formValidation';

const handleBlur = (e) => {
  const { name, value } = e.target;
  const error = validateFormField(name, value);
  setErrors(prev => ({ ...prev, [name]: error }));
};
```

### Using Rate Limiting

**In API Route:**
```tsx
import { checkRateLimit } from '@/lib/security/rateLimiter';

export async function POST(req: NextRequest) {
  const allowed = await checkRateLimit(req, 'contact');
  if (!allowed) {
    return new Response('Too many requests', { status: 429 });
  }
  // Handle request
}
```

---

## 🐛 Troubleshooting

### Schema not appearing in Google Search?
1. Wait 7-14 days for Google crawl
2. Use Google Search Console Rich Results Test
3. Verify SchemaScript is in layout.tsx

### Dark mode text hard to read?
1. Check contrast with https://webaim.org/resources/contrastchecker
2. Verify dark mode CSS variables
3. Use `dark:text-gray-300` or lighter for muted text

### Rate limiter not working?
1. Verify UPSTASH_REDIS_REST_URL is set
2. Verify UPSTASH_REDIS_REST_TOKEN is set
3. Check checkRateLimit is called in API route
4. Review rate limit config matches endpoint

### Keyboard navigation not working?
1. Test with Tab key only (no mouse)
2. Check console for JS errors
3. Verify event handlers are attached
4. Test with keyboard debugger in DevTools

### OG images not showing on social?
1. Use social preview tool: https://www.socialsharepreview.com/
2. Check URL parameters are escaped
3. Verify endpoint returns proper ImageResponse
4. Wait for social media cache to clear

---

## 📞 Support References

### Documentation Files
- Full verification report: `CRITICAL_TIER_VERIFICATION_COMPLETE.md`
- Action items checklist: `ENTERPRISE_ACTION_ITEMS.md`
- Form validation guide: See `lib/formValidation.ts` comments
- Rate limiting details: See `lib/security/rateLimiter.ts` comments
- Schema guide: See `lib/schema.ts` comments

### External Tools
- Schema validation: https://validator.schema.org/
- Contrast checker: https://webaim.org/resources/contrastchecker/
- Google Search Console: https://search.google.com/search-console/
- Lighthouse: Built into Chrome DevTools
- Accessibility checker: https://www.webaim.org/

---

## ✅ Sign-Off

**Critical Tier Status:** ✅ COMPLETE  
**All 44 Items:** ✅ VERIFIED  
**Ready for Deployment:** ✅ YES  

---

Generated: April 3, 2026  
Version: 1.0
