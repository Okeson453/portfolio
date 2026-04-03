import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

/**
 * GET /api/blog/search
 * Search blog posts by query
 * Query params:
 *   - q: search query (required)
 *   - limit: max results (default: 10)
 */
export const GET = withErrorHandling(async (request: NextRequest): Promise<NextResponseType> => {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q')?.toLowerCase() || '';
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!query || query.length < 2) {
            throw ApiError.badRequest('Query must be at least 2 characters');
        }

        // Mock blog posts (replace with database/search engine)
        const allPosts = [
            {
                id: 1,
                slug: 'devsecops-fintech',
                title: 'Implementing DevSecOps in FinTech Applications',
                excerpt: 'A comprehensive guide to integrating security into CI/CD pipelines for financial applications.',
                date: '2024-03-15',
                readTime: '8 min',
                category: 'Security',
                tags: ['DevSecOps', 'FinTech', 'CI/CD', 'Security'],
                image: '/images/blog/devsecops.jpg',
                views: '1.2k',
                content: 'Full content about DevSecOps, security, CI/CD pipelines...',
            },
            {
                id: 2,
                slug: 'vulnerability-scanner',
                title: 'Building a Custom Vulnerability Scanner with Python',
                excerpt: 'Learn how to create an automated vulnerability scanner for web applications.',
                date: '2024-03-10',
                readTime: '10 min',
                category: 'Development',
                tags: ['Python', 'Security', 'Automation', 'Web'],
                image: '/images/blog/scanner.jpg',
                views: '2.1k',
                content: 'Full content about vulnerability scanning, Python, web security...',
            },
            {
                id: 3,
                slug: 'security-mistakes',
                title: 'Common Security Mistakes in Modern Web Applications',
                excerpt: 'Avoid these critical security pitfalls in your next web development project.',
                date: '2024-03-05',
                readTime: '6 min',
                category: 'Best Practices',
                tags: ['Security', 'Web Development', 'Best Practices', 'OWASP'],
                image: '/images/blog/mistakes.jpg',
                views: '3.4k',
                content: 'Full content about security best practices, OWASP, web development...',
            },
        ];

        // Search across title, excerpt, and tags
        const results = allPosts.filter((post) => {
            const searchableText = [
                post.title,
                post.excerpt,
                post.tags.join(' '),
                post.category,
            ]
                .join(' ')
                .toLowerCase();

            return searchableText.includes(query);
        });

        // Highlight matches
        const highlighted = results.slice(0, limit).map((post) => {
            const titleMatches = post.title.toLowerCase().includes(query);
            const excerptMatches = post.excerpt.toLowerCase().includes(query);

            return {
                ...post,
                highlighted: {
                    title: titleMatches,
                    excerpt: excerptMatches,
                },
            };
        });

        return createSuccessResponse({
            query,
            results: highlighted,
            total: results.length,
        });
});
