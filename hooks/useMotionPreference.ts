/**
 * useMotionPreference Hook
 * WCAG 2.2 AAA Level: Respects prefers-reduced-motion for accessibility
 * Returns true if user prefers reduced motion, false otherwise
 */

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * useMotionVariants Hook
 * Returns Framer Motion variants based on prefers-reduced-motion preference
 * If user prefers reduced motion, returns empty objects to disable animations
 */

export function useMotionVariants(
  initial?: Record<string, any>,
  animate?: Record<string, any>,
  exit?: Record<string, any>
) {
  const prefersReducedMotion = useReducedMotion();

  return {
    initial: prefersReducedMotion ? {} : initial,
    animate: prefersReducedMotion ? {} : animate,
    exit: prefersReducedMotion ? {} : exit,
  };
}
