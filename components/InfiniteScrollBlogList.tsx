'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInfiniteScroll } from '@/hooks';
import { Calendar, Clock, Eye } from 'lucide-react';
import { SkeletonCard } from '@/components/ui/SkeletonComponents';
import { Loader2 } from 'lucide-react';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  views: string;
}

interface InfiniteScrollBlogListProps {
  category?: string;
  limit?: number;
}

export function InfiniteScrollBlogList({
  category,
  limit = 10,
}: InfiniteScrollBlogListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: ['blog-posts', category],
      queryFn: async ({ pageParam = null }) => {
        const params = new URLSearchParams();
        if (pageParam) params.append('cursor', pageParam.toString());
        params.append('limit', limit.toString());
        if (category) params.append('category', category);

        const response = await fetch(`/api/blog/posts?${params}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
      },
      getNextPageParam: (lastPage) => lastPage.pagination?.cursor,
      initialPageParam: null,
    });

  const sentinelRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const allPosts = data?.pages.flatMap((page) => page.data) ?? [];

  if (error) {
    return (
      <div className="w-full rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
        <p className="text-red-700 dark:text-red-200">
          Failed to load blog posts. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Initial loading state */}
        {isLoading && (
          <>
            {Array.from({ length: limit }).map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </>
        )}

        {/* Posts */}
        {allPosts.map((post: BlogPost) => (
          <article key={post.id} className="group">
            <Link href={`/blog/${post.slug}`}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10 h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20" />
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}

        {/* Pagination loading state */}
        {isFetchingNextPage && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={`loading-${i}`} />
            ))}
          </>
        )}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="py-12 flex justify-center">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more posts...</span>
          </div>
        ) : hasNextPage ? (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Scroll down to load more posts
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No more posts to load
          </p>
        )}
      </div>
    </div>
  );
}
