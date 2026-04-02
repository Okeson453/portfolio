# SEO Implementation Checklist — FIX-03

## ✅ Completed Implementations

### Core Files Created
- **`lib/seo.ts`** — Single source of truth for all SEO configuration
- **`app/opengraph-image.tsx`** — Dynamic OG image generator (1200×630px)
- **`app/projects/[slug]/page.tsx`** — Dynamic project pages with metadata and schema

### Files Updated
- **`app/layout.tsx`** — Root layout with WebSite schema and metadata
- **`app/page.tsx`** — Home page with Person schema
- **`app/projects/layout.tsx`** — Projects list page metadata
- **`app/robots.ts`** — Robots.txt with siteConfig reference
- **`app/sitemap.ts`** — Dynamic sitemap including all projects

---

## 🔧 Configuration Required

### 1. Update `lib/seo.ts` with Your Information

Replace these placeholders in [lib/seo.ts](lib/seo.ts):

```typescript
export const siteConfig = {
  name: 'SecureStack',
  fullName: '[YOUR FULL NAME]',  // ← Replace
  title: '[YOUR NAME] — Cybersecurity & Full-Stack Developer',  // ← Replace
  description: 'Your description here',  // ← Replace
  url: 'https://securestack.dev',  // ← Replace with your actual domain
  ogImage: '/og-image.png',
  twitterHandle: '@yourhandle',  // ← Replace
  githubUrl: 'https://github.com/yourusername',  // ← Replace
  linkedinUrl: 'https://linkedin.com/in/yourname',  // ← Replace
  email: 'you@example.com',  // ← Replace
  location: 'Abuja, Nigeria',  // ← Keep or replace
  keywords: [
    '[YOUR FULL NAME]',  // ← Replace
    // ... rest
  ],
};
```

### 2. Create Static OG Image

**File:** `public/og-image.png`
- **Exact dimensions:** 1200×630px
- **Format:** PNG
- **Content suggestions:**
  - Background: Dark color (#0a0a0a) matching your brand
  - Your full name — large, bold
  - Your title — subtitle
  - Your domain URL — bottom right corner
  - Optional: Logo/avatar — top left or right

**Tools to create:**
- Figma (free tier available)
- Canva (easiest for non-designers)
- Adobe Photoshop
- DALL-E 3 + Image Editor

### 3. Create Project-Specific OG Images (Optional)

For each major project, create:
- **File:** `public/og-projects.png` or project-specific images
- Same 1200×630px spec as homepage OG image

---

## 🔐 Environment Variables (Optional)

Add these to `.env.local` if using environment-based URLs:

```bash
NEXT_PUBLIC_APP_URL=https://securestack.dev
```

The sitemap.ts and robots.ts will automatically use `siteConfig.url` from `lib/seo.ts`.

---

## 📊 Verification Steps

### Step 1: Verify Sitemap & Robots
```bash
# After deploying or running locally:

# Check sitemap is accessible (~10-20 routes)
curl https://yourdomain.com/sitemap.xml

# Check robots.txt
curl https://yourdomain.com/robots.txt

# Check dynamic OG image
open https://yourdomain.com/opengraph-image
```

### Step 2: Validate OG Meta Tags
1. **Open Graph Debugger:**
   - Go to https://opengraph.xyz/
   - Paste your homepage URL: `https://yourdomain.com`
   - Should show:
     - ✅ `og:image` with your 1200×630 image
     - ✅ `og:title` — Your name + title
     - ✅ `og:description` — Full description

2. **Twitter Card Validator:**
   - Go to https://cards-dev.twitter.com/validator
   - Paste your homepage URL
   - Should show `summary_large_image` card type

### Step 3: Validate Structured Data
1. **Google Rich Results Tester:**
   - Go to https://search.google.com/test/rich-results
   - Paste your homepage URL
   - Should detect:
     - ✅ **Person** schema on homepage
     - ✅ **SoftwareApplication** schema on project pages

2. **Schema.org Validation:**
   - Go to https://validator.schema.org/
   - Paste your project URL
   - Verify all schema properties are valid

### Step 4: Submit to Google Search Console
1. Go to https://search.google.com/search-console
2. **Add property** → Enter your domain
3. Navigate to **Sitemaps** in the left menu
4. Submit your sitemap: `https://yourdomain.com/sitemap.xml`
5. Wait 24-48 hours for Google to crawl and index

### Step 5: Social Media Sharing Test
1. **LinkedIn:** Share your homepage URL
   - Should preview with your OG image + title + description
2. **Twitter/X:** Share your homepage URL
   - Should preview with `summary_large_image` card
3. **Facebook:** Share your homepage URL
   - Should preview with your OG image + title + description

### Step 6: Check Page Titles Uniqueness
In browser DevTools, verify each page has unique `<title>`:
```html
<!-- Homepage -->
<title>Your Name — Cybersecurity & Full-Stack Developer</title>

<!-- Projects -->
<title>Projects | SecureStack</title>

<!-- Individual Project -->
<title>Enterprise Vulnerability Scanner | SecureStack</title>

<!-- About -->
<title>About | SecureStack</title>
```

---

## 🎯 What This Fixes

| Issue | Before | After | Impact |
|-------|--------|-------|--------|
| **Social Share Preview** | Blank/no image | Branded 1200×630 image | ✅ Visible on LinkedIn, Twitter, Slack |
| **Per-Page Titles** | All show "SecureStack \| ..." | Unique per page | ✅ Better CTR in search results |
| **Structured Data** | None | Person schema | ✅ Google knowledge panel eligible |
| **Project Schema** | None | SoftwareApplication schema | ✅ Rich snippets for projects |
| **Project Discoverability** | Not in sitemap | All projects in XML sitemap | ✅ Google indexes all projects |
| **Robots Instructions** | Outdated URL refs | Clean, centralized config | ✅ Consistent indexing rules |

---

## 📝 Notes

- **Dynamic OG Image:** `app/opengraph-image.tsx` generates a branded image at build time using `next/og`. This is the fastest way to support per-page OG images without maintaining 50+ static images.
- **Static Fallback:** If `next/og` fails, the browser will still use the static `public/og-image.png` as fallback.
- **Metadata Inheritance:** Child pages automatically inherit the template title format from `app/layout.tsx` (e.g., "Projects | SecureStack").
- **Project Page Generation:** All project pages are pre-generated at build time via `generateStaticParams()` for instant performance.
- **No Hardcoded URLs:** All URLs reference `siteConfig.url` — single update point if you change domain.

---

## 🚀 Expected SEO Impact (48–72 hours)

✅ **Immediate (0–24 hrs):**
- OG images show on social media shares
- Unique page titles appear in SERP previews

✅ **Short-term (24–72 hrs):**
- Google crawls sitemap and indexes all projects
- Rich results start appearing in search console

✅ **Long-term (1–4 weeks):**
- Person schema visible in Google knowledge panel
- SoftwareApplication schema visible for projects
- Increased CTR from rich snippets in SERP

---

## 🐛 Troubleshooting

### OG Image Not Showing on Social Media
1. Clear browser cache: `Ctrl+Shift+Delete` (Chrome)
2. Re-share the URL on social platform
3. Use OG debugger to verify: https://opengraph.xyz/
4. Ensure `public/og-image.png` exists (1200×630px)

### Sitemap Not Indexed
1. Verify it's accessible: `curl https://yourdomain.com/sitemap.xml`
2. Confirm projects array is populated in `lib/projectsData.ts`
3. Manually submit in Google Search Console
4. Check for 404 errors in Google Search Console

### Structured Data Not Detected
1. Ensure `<script type="application/ld+json">` tags are present in source
2. Use JSON validator at https://jsonlint.com/
3. Test on https://validator.schema.org/
4. Wait 24+ hours for Google to re-crawl

---

## 📎 Reference Links

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Google Search Console](https://search.google.com/search-console)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
