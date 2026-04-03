/**
 * Related Posts Component
 *
 * Shows topically related blog posts below the current article.
 * Improves internal link structure, session duration, and topical authority.
 *
 * Relationship detection:
 * 1. Same category (higher weight)
 * 2. Shared tags (medium weight)
 * 3. Most recent posts (lower weight)
 *
 * Maximum 4 posts to prevent cognitive overload.
 */

import Link from 'next/link';
import { getAllBlogPosts, type BlogPost } from '@/lib/blog';

interface RelatedPostsProps {
  currentSlug: string;
  currentTags: string[];
  currentCategory: string;
  limit?: number;
}

export function RelatedPosts({
  currentSlug,
  currentTags,
  currentCategory,
  limit = 4,
}: RelatedPostsProps) {
  const allPosts = getAllBlogPosts();
  
  // Filter out current post
  const candidates = allPosts.filter((post) => post.slug !== currentSlug);

  // Score posts based on relevance
  const scoredPosts = candidates.map((post) => {
    let score = 0;

    // Same category: +10 points
    if (post.category === currentCategory) {
      score += 10;
    }

    // Shared tags: +5 points per tag (max 2 tags)
    const sharedTags = post.tags.filter((tag) => currentTags.includes(tag));
    score += sharedTags.length * 5;

    return { post, score };
  });

  // Sort by score desc, then by recency
  const relatedPosts = scoredPosts
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .slice(0, limit)
    .map(({ post }) => post);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-posts-heading"
      className="mt-16 pt-8 border-t border-slate-800"
    >
      <h2
        id="related-posts-heading"
        className="text-2xl font-bold mb-6 text-white"
      >
        Related Security Articles
      </h2>

      <div className="grid gap-4">
        {relatedPosts.map((post) => (
          <article
            key={post.slug}
            className="p-4 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors group"
          >
            {/* Post Title — Keyword-rich link */}
            <h3 className="mb-2">
              <Link
                href={`/blog/${post.slug}`}
                className="text-lg font-semibold text-blue-400 group-hover:text-blue-300 transition-colors"
              >
                {post.title}
              </Link>
            </h3>

            {/* Excerpt */}
            <p className="text-slate-400 text-sm mb-3">{post.description}</p>

            {/* Meta: Category + Read Time */}
            <div className="flex gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-600" />
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-600" />
                {post.readTime} min read
              </span>
            </div>

            {/* Tags — Keyword clustering for schema */}
            {post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* CTA — Drive engagement */}
      <div className="mt-6 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          View All Articles →
        </Link>
      </div>
    </section>
  );
}
