import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';
import { projects } from '@/lib/projectsData';

/**
 * Projects sitemap
 *
 * Separate from main sitemap for:
 * - Granular project update tracking
 * - Individual Search Console management
 * - Faster indexing when projects are added/updated
 *
 * Priority:
 * - Featured projects: 0.8
 * - Regular projects: 0.65
 */
export default function sitemapProjects(): MetadataRoute.Sitemap {
    return projects.map((project) => ({
        url: `${siteConfig.url}/projects/${project.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: project.featured ? 0.8 : 0.65,
    }));
}
