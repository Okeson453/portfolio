'use client'
import { useEffect, useRef, useState, ReactNode, memo } from 'react'

interface LazySectionProps {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
}

const LazySection = memo(function LazySection({
  children,
  fallback = null,
  threshold = 0.1
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Optimize: reuse observer instance
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          // Keep observing to handle visibility changes
          // but we only need to render once
        }
      },
      {
        threshold,
        rootMargin: '50px' // Start loading 50px before visible
      }
    )

    if (ref.current) {
      observerRef.current.observe(ref.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, isVisible])

  return (
    <div ref={ref} data-lazy-section={isVisible ? 'loaded' : 'pending'}>
      {isVisible ? children : fallback}
    </div>
  )
}, (prevProps, nextProps) => {
  // Prevent unnecessary re-renders
  return prevProps.children === nextProps.children &&
    prevProps.threshold === nextProps.threshold
})

export default LazySection
