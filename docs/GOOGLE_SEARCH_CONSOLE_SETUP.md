# 🔍 Google Search Console Setup Guide
**Portfolio:** Okeson.dev  
**Date:** April 3, 2026  
**Est. Time:** 30 minutes  

---

## 📋 Overview

Google Search Console (GSC) is the gateway between your website and Google's search index. It provides:

- ✅ **Indexing status** — Which pages Google has crawled and indexed
- 📊 **Search performance** — Top queries, CTR, rankings, impressions
- ⚠️ **Index coverage errors** — Pages that failed to index
- 🎯 **Core Web Vitals** — Real-world page speed & responsiveness
- 🔗 **Backlinks** — Who's linking to your site
- 🗺️ **Sitemap submission** — Tell Google about all your content

---

## 🚀 Step-by-Step Setup

### **Step 1: Add Your Property (2 minutes)**

1. Go to **[Google Search Console](https://search.google.com/search-console)**
2. Sign in with your Google account (same one you use for Gmail)
3. Click **"Add property"** (top left)
4. Choose **"URL prefix"** option
5. Enter your domain: `https://okeson.dev`
6. Click **"Continue"**

You'll be prompted to verify ownership. Choose the **HTML tag** method (easiest).

---

### **Step 2: Verify Ownership via HTML Tag (5 minutes)**

1. Google will show you:
   ```html
   <meta name="google-site-verification" content="ABC123XYZ..." />
   ```

2. Copy the **verification token** (the part after `content="`). It looks like: `ABC123XYZ1a2b3c...`

3. Open `.env.local` in your project:
   ```bash
   nano .env.local
   # or open with VS Code
   ```

4. Add the token:
   ```env
   GOOGLE_SITE_VERIFICATION=ABC123XYZ1a2b3c...
   ```

5. **Save and restart your dev server:**
   ```bash
   npm run dev
   ```

6. Return to Google Search Console and click **"Verify"**

7. You should see a green checkmark: ✅ **Ownership verified**

---

### **Step 3: Submit Sitemaps (10 minutes)**

Sitemaps tell Google which pages to crawl. You have three:

1. **Homepage + main pages:** `https://okeson.dev/sitemap.xml`
2. **Blog posts:** `https://okeson.dev/sitemap-blog.xml`
3. **Projects:** `https://okeson.dev/sitemap-projects.xml`

**To submit:**

1. In Google Search Console, go to **"Sitemaps"** (left sidebar)
2. Paste the first URL: `https://okeson.dev/sitemap.xml`
3. Click **"Submit"**
4. Repeat for the other two sitemaps

You should see: **✅ Submitted** for each one.

---

### **Step 4: Check Indexing Status (5 minutes)**

1. Go to **"Coverage"** (left sidebar)
2. Look for status bars:
   - 🟢 **Valid** — Pages Google successfully indexed
   - 🟠 **Warnings** — Pages indexed but with issues
   - 🔴 **Errors** — Pages that failed to index

**First-time setup:** Expect 0–3 indexed pages at first. Google crawls gradually (24–48 hours).

---

### **Step 5: Verify Your Schemas Are Parsed (10 minutes)**

Google Search Console validates your JSON-LD schemas:

1. Go to **"Enhancements"** (left sidebar)
2. Look for:
   - **Rich Results** (Article, FAQ, etc.)
   - **Mobile-Friendly Test**
   - **Core Web Vitals**

3. Click **"Rich Results"** to see if your schemas are valid:
   - ✅ **Valid items** — Your `<script type="application/ld+json">` is correct
   - ⚠️ **Issues** — Fix any schema errors

If you see issues, use [Schema.org Validator](https://validator.schema.org) to debug.

---

## 📈 Ongoing Monitoring Checklist

### **Weekly (5 min)**
- [ ] Check **Coverage** for new errors
- [ ] Review **Core Web Vitals** — any red (Poor) metrics?

### **Monthly (15 min)**
- [ ] Go to **"Search results"** → Check top 10 queries
- [ ] Note your **average CTR** and **rank position**
- [ ] Look for opportunities (queries with impressions but 0 clicks)

### **Quarterly (30 min)**
- [ ] Full **Performance audit**:
  - Top 20 keywords
  - Bottom 10 pages (low impressions)
  - New pages being indexed?
- [ ] **Backlink analysis** in "Links" section
- [ ] Cross-reference with Analytics (GA4)

---

## 🎯 Quick Troubleshooting

### **"Ownership not verified" after HTML tag submission?**

**Solution:**
1. Hard refresh your dev server: `Ctrl+Shift+Delete` (browser cache)
2. Verify the token in `.env.local` matches exactly
3. Ensure `npm run dev` is running and file changes are reflected
4. Try verifying again in Google Search Console

### **Sitemaps submitted but "Coverage" shows no indexed pages?**

**This is normal.** Google indexes pages gradually:
- Day 1: Crawls sitemap, reads robots.txt, discovers URLs
- Day 3–7: Crawls each page, parses schemas, starts indexing
- Week 2: Most pages indexed

Check back in **2 weeks** for realistic indexing stats.

### **Getting "Blocked by robots.txt" error?**

**Solution:** Your robots.txt might be blocking Google (or the staging environment).

Check `public/robots.txt`:
```
User-agent: Googlebot
Allow: /   # ← Must say ALLOW, not DISALLOW
```

If wrong, fix it and resubmit the sitemap in GSC.

### **Rich Results (schemas) showing as "Issues"?**

**Solution:** Use [Google Rich Results Test](https://search.google.com/test/rich-results) to validate:
1. Paste your blog post or project URL
2. See which schemas failed
3. Common issues:
   - Missing required fields (like `datePublished`)
   - Boolean/date format wrong
   - Invalid URL structure

Fix in `lib/schema.ts` and re-test.

---

## 🔗 Useful Links

| Tool | URL |
|------|-----|
| **Google Search Console** | https://search.google.com/search-console |
| **Search Console Help** | https://support.google.com/webmasters |
| **Rich Results Test** | https://search.google.com/test/rich-results |
| **Schema Validator** | https://validator.schema.org |
| **Mobile-Friendly Test** | https://search.google.com/test/mobile-friendly |
| **Google PageSpeed Insights** | https://pagespeed.web.dev |

---

## 📊 Key Metrics to Track

Create a **monthly tracking spreadsheet** with:

| Month | Indexed Pages | Top Query | Avg CTR | Avg Position | Organic Traffic |
|-------|---------------|-----------|---------|--------------|-----------------|
| Apr | 5 | - | - | - | ~0 |
| May | 12 | cybersecurity portfolio | 2.1% | 18 | ~15 |
| Jun | 18 | security engineer | 3.5% | 12 | ~40 |

**Goal progression:**
- **Month 1–2:** Get indexed
- **Month 3–4:** See rankings 10–20
- **Month 6+:** Rankings 3–8, 100+ organic visitors/month

---

## ⚡ Quick Wins (Do These Today)

1. ✅ Add property to GSC
2. ✅ Verify via HTML tag
3. ✅ Submit 3 sitemaps
4. ✅ Check "Rich Results" for schema validation
5. ✅ Set reminders for weekly monitoring

**After this setup, you're ready for ongoing optimization!**

---

*Last updated: April 3, 2026*  
*Next: Begin monitoring weekly in Search Console*
