import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

/**
 * Enterprise robots.txt configuration
 *
 * - Allows all content for human users and ethical crawlers
 * - Blocks AI training crawlers (GPTBot, CCBot, anthropic-ai, etc.)
 * - Sets crawl-delay for responsible access
 * - Points to all sitemaps for efficient discovery
 *
 * These rules are also available in public/robots.txt as flat file.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ─ General crawlers ────────────────────────────────────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/admin/',
          '/settings/',
          '/dashboard/',
          '/.next/',
          '/private/',
          '/*?preview=',
          '/*?draft=',
          '/*?token=',
        ],
        crawlDelay: 1, // Be polite — 1 second between requests
      },

      // ─ Googlebot — no rate limiting needed ─────────────────────────────────
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },

      // ─ AI and Content Scraper Blocking ───────────────────────────────────
      // These do NOT affect search rankings but prevent unauthorized usage
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'OpenAI',
        disallow: '/',
      },
      {
        userAgent: 'DadJokeBot',
        disallow: '/',
      },
    ],

    // ─ Multiple sitemaps for granular indexing ───────────────────────────
    sitemap: [
      `${siteConfig.url}/sitemap.xml`,      // Static routes
      `${siteConfig.url}/sitemap-blog.xml`, // Blog posts (high velocity)
      `${siteConfig.url}/sitemap-projects.xml`, // Projects
    ],
  };
}
