import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';
import { blogPosts } from '@/lib/blog';

/**
 * Blog posts sitemap
 *
 * Separate from main sitemap because:
 * - Blog posts have high change frequency (daily or weekly)
 * - Allows granular re-indexing without re-submitting static routes
 * - Can be individually managed in Search Console
 *
 * Priority: 0.6-0.8
 * - Featured posts: 0.8
 * - Regular posts: 0.6
 */
export default function sitemapBlog(): MetadataRoute.Sitemap {
    return blogPosts.map((post) => ({
        url: `${siteConfig.url}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));
}
