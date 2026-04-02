'use client'

/**
 * Client-side Dynamic Components
 * Handles components that should not be SSR-rendered
 * This wrapper is necessary for ssr: false in Next.js Server Components
 */

import dynamic from 'next/dynamic'

// Skeleton for loading states
const SectionSkeleton = () => (
    <div className="h-96 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 animate-pulse" />
)

// Client-only imports with ssr: false
const Timeline = dynamic(() => import('./Timeline'), {
    loading: () => <SectionSkeleton />,
    ssr: false,
})

const DeferredSections = dynamic(() => import('./DeferredSections').then(mod => ({ default: mod.DeferredSections })), {
    loading: () => <SectionSkeleton />,
    ssr: false,
})

export { Timeline, DeferredSections }
