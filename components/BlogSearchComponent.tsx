'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { SkeletonText } from '@/components/ui/SkeletonComponents';

interface SearchResult {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  highlighted: {
    title: boolean;
    excerpt: boolean;
  };
}

export function BlogSearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ['blog-search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        return null;
      }

      const response = await fetch(
        `/api/blog/search?q=${encodeURIComponent(debouncedSearch)}`
      );
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
    enabled: debouncedSearch.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  const handleHighlight = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-8">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search blog articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {/* Search stats */}
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isLoading && 'Searching...'}
            {!isLoading && data && `Found ${data.results?.length || 0} result(s)`}
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && searchTerm && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <SkeletonText lines={2} />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">Search Error</h3>
            <p className="text-sm text-red-700 dark:text-red-200 mt-1">
              Failed to search. Please try again.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && searchTerm && (!data?.results || data.results.length === 0) && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No articles found matching "{searchTerm}"
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Try different keywords or browse all articles
          </p>
        </div>
      )}

      {/* No search yet */}
      {!searchTerm && !data && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Start typing to search blog articles
          </p>
        </div>
      )}

      {/* Results */}
      {!isLoading && data?.results && data.results.length > 0 && (
        <div className="space-y-4">
          {data.results.map((result: SearchResult) => (
            <a
              key={result.id}
              href={`/blog/${result.slug}`}
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                    {result.highlighted.title
                      ? handleHighlight(result.title, debouncedSearch)
                      : result.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {result.highlighted.excerpt
                      ? handleHighlight(result.excerpt, debouncedSearch)
                      : result.excerpt}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-medium text-blue-700 dark:text-blue-300">
                    {result.category}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{result.date}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
