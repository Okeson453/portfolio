import { useReducedMotion, type Variants } from 'framer-motion';

/**
 * Hook to automatically switch between full and reduced motion variants
 * based on the user's prefers-reduced-motion media query
 * 
 * @param fullMotion - Framer Motion variants with animations
 * @param reducedMotion - Simplified variants respecting motion preference
 * @returns Appropriate variants based on user preference
 * 
 * @example
 * const variants = useMotionVariants(
 *   {
 *     hidden: { opacity: 0, y: 20 },
 *     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
 *   },
 *   {
 *     hidden: { opacity: 0 },
 *     visible: { opacity: 1, transition: { duration: 0.1 } }
 *   }
 * );
 */
export function useMotionVariants(
  fullMotion: Variants,
  reducedMotion: Variants = {}
): Variants {
  const prefersReduced = useReducedMotion();
  return prefersReduced ? { ...fullMotion, ...reducedMotion } : fullMotion;
}
