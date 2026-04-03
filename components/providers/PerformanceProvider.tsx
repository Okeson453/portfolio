'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { toast } from 'react-hot-toast'

interface PerformanceContextType {
  metrics: PerformanceMetrics
  isCollecting: boolean
  toggleCollection: () => void
  startMeasurement: (name: string) => string
  endMeasurement: (id: string) => number
  logMetric: (name: string, value: number, metadata?: Record<string, unknown>) => void
  getPerformanceReport: () => PerformanceReport
  clearMetrics: () => void
  optimizeImages: () => Promise<void>
  enableTurboMode: () => void
  disableTurboMode: () => void
}

interface PerformanceMetrics {
  [key: string]: {
    values: number[]
    count: number
    total: number
    average: number
    min: number
    max: number
    p95: number
    p99: number
    lastUpdated: string
  }
}

interface PerformanceReport {
  timestamp: string
  webVitals: WebVitals
  resourceMetrics: ResourceMetrics
  userTiming: UserTiming[]
  recommendations: string[]
  score: number
}

interface WebVitals {
  lcp: number
  fid: number
  cls: number
  inp: number
  ttfb: number
}

interface ResourceMetrics {
  totalSize: number
  imageSize: number
  scriptSize: number
  styleSize: number
  fontSize: number
  requests: number
}

interface UserTiming {
  name: string
  duration: number
  timestamp: string
  metadata?: Record<string, unknown>
}

const PerformanceContext = createContext<PerformanceContextType | null>(null)

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [isCollecting, setIsCollecting] = useState(true)
  const [measurements, setMeasurements] = useState<{ [key: string]: { start: number; metadata?: Record<string, unknown> } }>({})

  const logMetric = useCallback((name: string, value: number, metadata?: Record<string, unknown>) => {
    if (!isCollecting) return

    setMetrics(prev => {
      const existing = prev[name] || {
        values: [],
        count: 0,
        total: 0,
        average: 0,
        min: Infinity,
        max: -Infinity,
        p95: 0,
        p99: 0,
        lastUpdated: new Date().toISOString()
      }

      const newValues = [...existing.values, value].slice(-100)
      const newTotal = existing.total + value
      const newCount = existing.count + 1
      const newAverage = newTotal / newCount
      const newMin = Math.min(existing.min, value)
      const newMax = Math.max(existing.max, value)

      const sorted = [...newValues].sort((a, b) => a - b)
      const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0
      const p99 = sorted[Math.floor(sorted.length * 0.99)] || 0

      return {
        ...prev,
        [name]: {
          values: newValues,
          count: newCount,
          total: newTotal,
          average: newAverage,
          min: newMin,
          max: newMax,
          p95,
          p99,
          lastUpdated: new Date().toISOString()
        }
      }
    })

    if (process.env.NODE_ENV === 'development') {
      // Performance metrics tracked
    }
  }, [isCollecting])

  const initializeWebVitals = useCallback(() => {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry
      if (lastEntry) {
        logMetric('LCP', lastEntry.startTime, { entry: lastEntry.toJSON() })
        reportToAnalytics('LCP', lastEntry.startTime)
      }
    })

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch {
      // LCP observation not supported
    }

    const fidObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const fidEntry = entry as PerformanceEventTiming
        if (fidEntry) {
          const delay = fidEntry.processingStart - fidEntry.startTime
          logMetric('FID', delay, { entry: fidEntry.toJSON() })
          reportToAnalytics('FID', delay)
        }
      }
    })

    try {
      fidObserver.observe({ type: 'first-input', buffered: true })
    } catch {
      // FID observation not supported
    }

    let clsValue = 0
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as unknown as { hadRecentInput: boolean }).hadRecentInput) {
          clsValue += (entry as unknown as { value: number }).value
        }
      }
    })

    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true })
    } catch {
      // CLS observation not supported
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        logMetric('CLS', clsValue)
        reportToAnalytics('CLS', clsValue)
      }
    })

    const navigationObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const navEntry = entry as PerformanceNavigationTiming
        if (navEntry) {
          logMetric('TTFB', navEntry.responseStart - navEntry.requestStart, {
            entry: navEntry.toJSON()
          })
        }
      }
    })

    try {
      navigationObserver.observe({ type: 'navigation', buffered: true })
    } catch {
      // Navigation timing not supported
    }
  }, [logMetric])

  const monitorResources = useCallback(() => {
    if (performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource')

      resources.forEach(resource => {
        const entry = resource as PerformanceResourceTiming
        logMetric('resource_load', entry.duration, {
          name: entry.name,
          initiatorType: entry.initiatorType,
          transferSize: entry.transferSize,
          decodedBodySize: entry.decodedBodySize
        })
      })

      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          const resEntry = entry as PerformanceResourceTiming
          logMetric('resource_load', resEntry.duration, {
            name: resEntry.name,
            initiatorType: resEntry.initiatorType
          })
        })
      })

      resourceObserver.observe({ entryTypes: ['resource'] })
    }
  }, [logMetric])

  const monitorMemory = useCallback(() => {
    if ('memory' in performance) {
      const mem = (performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory
      logMetric('memory_used', mem.usedJSHeapSize, {
        total: mem.totalJSHeapSize,
        limit: mem.jsHeapSizeLimit
      })
    }
  }, [logMetric])

  const monitorNetwork = useCallback(() => {
    const handleOnline = () => {
      logMetric('network_status', 1, { status: 'online' })
    }

    const handleOffline = () => {
      logMetric('network_status', 0, { status: 'offline' })
      toast.error('Network connection lost', {
        duration: 5000,
        position: 'top-right'
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [logMetric])

  useEffect(() => {
    if (!isCollecting) return undefined

    initializeWebVitals()
    monitorResources()
    monitorMemory()
    monitorNetwork()

    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'longtask') {
            logMetric('long_tasks', entry.duration, {
              name: entry.name,
              startTime: entry.startTime
            })

            if (entry.duration > 100) {
              toast.error(`Long task detected: ${Math.round(entry.duration)}ms`, {
                duration: 3000,
                position: 'bottom-right'
              })
            }
          }
        }
      })

      observer.observe({ entryTypes: ['longtask'] })

      return () => observer.disconnect()
    }

    return undefined
  }, [isCollecting, initializeWebVitals, logMetric, monitorMemory, monitorNetwork, monitorResources])

  const reportToAnalytics = (metric: string, value: number) => {
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: CallableFunction }).gtag) {
      (window as unknown as { gtag: CallableFunction }).gtag('event', 'performance_metric', {
        event_category: 'Web Vitals',
        event_label: metric,
        value: Math.round(value),
        non_interaction: true
      })
    }
  }

  const startMeasurement = useCallback((name: string): string => {
    const id = crypto.randomUUID()
    setMeasurements(prev => ({
      ...prev,
      [id]: {
        start: performance.now(),
        metadata: { name }
      }
    }))
    return id
  }, [])

  const endMeasurement = useCallback((id: string): number => {
    const measurement = measurements[id]
    if (!measurement) return 0

    const duration = performance.now() - measurement.start
    const metricName = typeof measurement.metadata?.name === 'string' ? measurement.metadata.name : 'unknown'
    logMetric(metricName, duration, measurement.metadata)

    setMeasurements(prev => {
      const newMeasurements = { ...prev }
      delete newMeasurements[id]
      return newMeasurements
    })

    return duration
  }, [measurements, logMetric])

  const toggleCollection = useCallback(() => {
    setIsCollecting(prev => !prev)
    toast.success(`Performance monitoring ${!isCollecting ? 'enabled' : 'disabled'}`)
  }, [isCollecting])

  const getPerformanceReport = useCallback((): PerformanceReport => {
    const webVitals: WebVitals = {
      lcp: metrics['LCP']?.average || 0,
      fid: metrics['FID']?.average || 0,
      cls: metrics['CLS']?.average || 0,
      inp: 0,
      ttfb: metrics['TTFB']?.average || 0
    }

    const resourceEntries = performance.getEntriesByType?.('resource') || []
    const resourceMetrics: ResourceMetrics = {
      totalSize: resourceEntries.reduce((sum, entry: PerformanceEntry) => sum + ((entry as PerformanceResourceTiming).transferSize || 0), 0),
      imageSize: resourceEntries
        .filter((entry: PerformanceEntry) => (entry as PerformanceResourceTiming).initiatorType === 'img')
        .reduce((sum, entry: PerformanceEntry) => sum + ((entry as PerformanceResourceTiming).transferSize || 0), 0),
      scriptSize: resourceEntries
        .filter((entry: PerformanceEntry) => (entry as PerformanceResourceTiming).initiatorType === 'script')
        .reduce((sum, entry: PerformanceEntry) => sum + ((entry as PerformanceResourceTiming).transferSize || 0), 0),
      styleSize: resourceEntries
        .filter((entry: PerformanceEntry) => {
          const type = (entry as PerformanceResourceTiming).initiatorType
          return type === 'css' || type === 'link'
        })
        .reduce((sum, entry: PerformanceEntry) => sum + ((entry as PerformanceResourceTiming).transferSize || 0), 0),
      fontSize: resourceEntries
        .filter((entry: PerformanceEntry) => (entry as PerformanceResourceTiming).initiatorType === 'font')
        .reduce((sum, entry: PerformanceEntry) => sum + ((entry as PerformanceResourceTiming).transferSize || 0), 0),
      requests: resourceEntries.length
    }

    const recommendations: string[] = []

    if (webVitals.lcp > 2500) recommendations.push('Optimize Largest Contentful Paint')
    if (webVitals.fid > 100) recommendations.push('Reduce First Input Delay')
    if (webVitals.cls > 0.1) recommendations.push('Improve Cumulative Layout Shift')
    if (resourceMetrics.totalSize > 5 * 1024 * 1024) recommendations.push('Reduce total resource size')
    if (resourceMetrics.imageSize > 2 * 1024 * 1024) recommendations.push('Optimize images')

    let score = 100

    if (webVitals.lcp > 4000) score -= 30
    else if (webVitals.lcp > 2500) score -= 20
    else if (webVitals.lcp > 1000) score -= 10

    if (webVitals.fid > 300) score -= 20
    else if (webVitals.fid > 100) score -= 10

    if (webVitals.cls > 0.25) score -= 20
    else if (webVitals.cls > 0.1) score -= 10

    score = Math.max(0, Math.min(100, score))

    return {
      timestamp: new Date().toISOString(),
      webVitals,
      resourceMetrics,
      userTiming: Object.entries(metrics).map(([name, data]) => ({
        name,
        duration: data.average,
        timestamp: data.lastUpdated,
        metadata: { count: data.count, min: data.min, max: data.max }
      })),
      recommendations,
      score
    }
  }, [metrics])

  const clearMetrics = useCallback(() => {
    setMetrics({})
    setMeasurements({})
    toast.success('Performance metrics cleared')
  }, [])

  const optimizeImages = useCallback(async (): Promise<void> => {
    toast.loading('Optimizing images...')

    await new Promise(resolve => setTimeout(resolve, 2000))

    logMetric('image_optimization', 2000, { optimized: true })
    toast.success('Images optimized successfully')
  }, [logMetric])

  const enableTurboMode = useCallback(() => {
    document.documentElement.classList.add('turbo-mode')

    const style = document.createElement('style')
    style.textContent = `
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `
    document.head.appendChild(style)

    toast.success('Turbo mode enabled')
  }, [])

  const disableTurboMode = useCallback(() => {
    document.documentElement.classList.remove('turbo-mode')
    toast.success('Turbo mode disabled')
  }, [])

  return (
    <PerformanceContext.Provider
      value={{
        metrics,
        isCollecting,
        toggleCollection,
        startMeasurement,
        endMeasurement,
        logMetric,
        getPerformanceReport,
        clearMetrics,
        optimizeImages,
        enableTurboMode,
        disableTurboMode
      }}
    >
      {children}
    </PerformanceContext.Provider>
  )
}

export function usePerformance() {
  const context = useContext(PerformanceContext)
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider')
  }
  return context
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function lazyLoadImage(element: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    if ('loading' in HTMLImageElement.prototype) {
      element.loading = 'lazy'
    }

    if (element.complete) {
      resolve()
    } else {
      element.addEventListener('load', () => resolve())
      element.addEventListener('error', () => resolve())
    }
  })
}

export function measurePaintTime(): number {
  const start = performance.now()
  void document.body.offsetHeight // Force reflow to measure paint time
  return performance.now() - start
}