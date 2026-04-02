'use client'

import { useEffect, ReactNode, useState } from 'react'

interface DeferredClientProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Defers client-side component loading until page is interactive
 * Uses requestIdleCallback for non-blocking deferred loads
 */
export function DeferredClient({ children, fallback = null }: DeferredClientProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for page to be interactive before loading heavy client components
    if ('requestIdleCallback' in window) {
      requestIdleCallback(
        () => setIsReady(true),
        { timeout: 2000 } // Fallback to 2s timeout if idle time not available
      )
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => setIsReady(true), 2000)
    }
  }, [])

  return isReady ? children : fallback
}
