import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  once?: boolean;
}

/**
 * Hook to detect when an element enters the viewport.
 * Replaces Framer Motion's whileInView with native IntersectionObserver.
 * 
 * @example
 * const { ref, isInView } = useInView({ threshold: 0.1, once: true });
 * 
 * return (
 *   <div ref={ref} className={isInView ? 'opacity-100' : 'opacity-0'}>
 *     Content animates in when scrolled into view
 *   </div>
 * );
 */
export function useInView({ threshold = 0.1, once = true }: UseInViewOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, isInView };
}
