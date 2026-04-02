'use client';

import { useState, useCallback, useRef, useMemo, useEffect, memo } from 'react';
import { Search, Loader } from 'lucide-react';
import Link from 'next/link';
import type { SearchResult, SearchHitsResponse } from '@/types';

interface SearchComponentProps {
  placeholder?: string;
  onResultSelect?: (result: SearchResult) => void;
  maxResults?: number;
  debounceMs?: number;
}

export const SearchComponent = memo(function SearchComponent({
  placeholder = 'Search blog posts, projects...',
  onResultSelect,
  maxResults = 10,
  debounceMs = 300,
}: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchResults = useCallback(
    async (searchQuery: string): Promise<void> => {
      if (searchQuery.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      // Cancel previous in-flight request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q: searchQuery,
          limit: String(maxResults),
        });

        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const data: SearchHitsResponse = await response.json();
        setResults(data.hits ?? []);
        setShowResults(true);
        setError(null);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') return;

        const errorMessage = err instanceof Error ? err.message : 'Search unavailable';
        setError(errorMessage);
        setResults([]);
        console.error('[SearchComponent]', err);
      } finally {
        setLoading(false);
      }
    },
    [maxResults]
  );

  // Memoize debounce function to maintain stable reference
  const debouncedFetch = useMemo(() => {
    return (query: string): void => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        void fetchResults(query);
      }, debounceMs);
    };
  }, [fetchResults, debounceMs]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      debouncedFetch(value);
    } else {
      setResults([]);
      setShowResults(false);
      setError(null);
    }
  }, [debouncedFetch]);

  const handleResultClick = useCallback((result: SearchResult): void => {
    onResultSelect?.(result);
    setShowResults(false);
    setQuery('');
  }, [onResultSelect]);

  const handleFocus = useCallback((): void => {
    if (query.length >= 2) {
      setShowResults(true);
    }
  }, [query.length]);

  const handleClickOutside = useCallback((event: MouseEvent): void => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setShowResults(false);
    }
  }, []);

  // Cleanup on unmount or when component updates
  useEffect(() => {
    // Add click-outside listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup: cancel fetch, clear timeout, remove listener
      abortRef.current?.abort();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search
          className="absolute left-3 top-3 h-5 w-5 text-slate-500"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-results"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:border-cyber-green focus:outline-none transition-colors"
        />
        {loading && (
          <Loader
            className="absolute right-3 top-3 h-5 w-5 animate-spin text-cyber-green"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && (results.length > 0 || loading || error) && (
        <>
          {loading && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-cyber-blue/20 bg-gradient-to-b from-slate-800 to-slate-900 shadow-lg z-50 p-4 text-center text-slate-400">
              <Loader className="inline h-4 w-4 animate-spin" aria-hidden="true" />
              <span className="sr-only">Loading search results...</span>
            </div>
          )}

          {error && (
            <div role="alert" className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-cyber-blue/20 bg-gradient-to-b from-slate-800 to-slate-900 shadow-lg z-50 p-4 text-center text-red-400 text-sm">
              {error}
            </div>
          )}

          {results.length > 0 && (
            <div
              id="search-results"
              role="listbox"
              aria-label="Search results"
              className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-cyber-blue/20 bg-gradient-to-b from-slate-800 to-slate-900 shadow-lg z-50 max-h-96 overflow-y-auto"
            >
              {results.map((result) => (
                <button
                  key={result.id}
                  role="option"
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left border-b border-slate-700/50 p-3 hover:bg-slate-700/50 transition-colors last:border-b-0 focus:outline-none focus:bg-slate-700/50"
                >
                  <p className="font-medium text-white">{result.title}</p>
                  <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                    {result.excerpt}
                  </p>
                  <span className="mt-1 inline-block text-xs font-medium text-cyber-green">
                    {result.category}
                  </span>
                </button>
              ))}
            </div>
          )}

          {!loading && !error && results.length === 0 && query.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-cyber-blue/20 bg-gradient-to-b from-slate-800 to-slate-900 shadow-lg z-50 p-4 text-center text-slate-400">
              No results found
            </div>
          )}
        </>
      )}
    </div>
  );
});

SearchComponent.displayName = 'SearchComponent';
