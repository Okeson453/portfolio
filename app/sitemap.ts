import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

/**
 * Primary sitemap for static routes
 *
 * This serves as the main sitemap index and includes all static pages.
 * Dynamic content (blog posts, projects) is organized in separate sitemaps
 * for granular indexing control and faster re-crawling of high-velocity content.
 *
 * Sitemaps:
 * - sitemap.xml           → Static routes (this file)
 * - sitemap-blog.xml      → Blog posts (high change frequency)
 * - sitemap-projects.xml  → Projects (medium change frequency)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date('2026-02-20'),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/skills`,
      lastModified: new Date('2026-02-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: `${siteConfig.url}/experience`,
      lastModified: new Date('2026-02-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  return staticRoutes;
}
