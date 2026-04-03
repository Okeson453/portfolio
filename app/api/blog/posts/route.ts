import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

/**
 * GET /api/blog/posts
 * Returns paginated blog posts
 * Query params:
 *   - cursor: cursor for pagination (postId)
 *   - limit: number of posts per page (default: 10)
 *   - category: filter by category
 */
export const GET = withErrorHandling(async (request: NextRequest): Promise<NextResponse> => {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');

    // Mock blog posts (replace with database query)
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
      },
      // Add more posts for pagination testing
      ...Array.from({ length: 20 }, (_, i) => ({
        id: 100 + i,
        slug: `blog-post-${100 + i}`,
        title: `Blog Post ${100 + i}: Advanced Security Topics`,
        excerpt: `This is an excerpt for blog post ${100 + i}...`,
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        readTime: `${5 + (i % 10)} min`,
        category: ['Security', 'Development', 'Best Practices'][i % 3],
        tags: ['Security', 'Development'],
        image: '/images/blog/default.jpg',
        views: `${(i * 150) % 5000}`,
      })),
    ];

    // Filter by category if provided
    let posts = allPosts;
    if (category) {
      posts = posts.filter((post) => post.category === category);
    }

    // Find current position
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = posts.findIndex((p) => p.id === parseInt(cursor));
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }

    // Get page of results
    const pageData = posts.slice(startIndex, startIndex + limit);

    // Determine if there are more results
    const hasMore = startIndex + limit < posts.length;
    const nextCursor = hasMore ? pageData[pageData.length - 1]?.id : null;

    return createSuccessResponse(
      {
        data: pageData,
        pagination: {
          cursor: nextCursor,
          hasMore,
          total: posts.length,
          limit,
        },
      }
    );
});
