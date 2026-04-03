'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Tag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const blogPosts = [
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
];

export function Blog() {
  return (
    <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Latest</span>{' '}
            <span className="text-blue-500">Articles</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Insights on cybersecurity, development best practices, and industry trends
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col h-full"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10 flex flex-col h-full">
                  {/* Image — 16:9 aspect ratio for consistency */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 z-10" />
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium hover:bg-black/80 transition-colors">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content — Flex column ensures full height usage */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        <time dateTime={post.date} className="whitespace-nowrap">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        <span className="whitespace-nowrap">{post.readTime} read</span>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <Eye className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        <span className="whitespace-nowrap">{post.views}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt — Responsive clamp: 2 lines mobile, 3 lines desktop */}
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 md:line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        >
                          <Tag className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                          +{post.tags.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Read More Link */}
                    <div className="flex items-center text-blue-500 font-medium group/link">
                      <span>Read article</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="group border-gray-300 dark:border-gray-700 hover:border-blue-500"
            asChild
          >
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Newsletter */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Subscribe to Security Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get the latest cybersecurity insights and development tips delivered to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}