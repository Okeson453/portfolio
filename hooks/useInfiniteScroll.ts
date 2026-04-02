'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * Custom hook for infinite scroll with IntersectionObserver
 * Automatically triggers callback when user scrolls near bottom
 *
 * @param callback - Function to call when reaching threshold
 * @param options - Configuration options
 * @returns Ref to attach to sentinel element
 *
 * @example
 * const sentinelRef = useInfiniteScroll(() => fetchNextPage());
 * return (
 *   <div>
 *     {items.map((item) => <div key={item.id}>{item.title}</div>)}
 *     <div ref={sentinelRef} />
 *   </div>
 * );
 */
export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '200px',
    enabled = true,
  } = options;

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && enabled) {
        callback();
      }
    },
    [callback, enabled]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, threshold, rootMargin]);

  return sentinelRef;
}
