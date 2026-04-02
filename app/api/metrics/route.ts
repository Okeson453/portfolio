/**
 * Metrics Collection API
 * Collects Web Vitals and performance metrics
 * Enhanced with statistics and filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withErrorHandling, ApiError, createSuccessResponse } from '@/lib/api/errorHandler'
import type { MetricsPayload } from '@/types'

const MetricsPayloadSchema = z.object({
  name: z.string().min(1).max(100),
  value: z.number().finite().nonnegative(),
  id: z.string().optional(),
  rating: z.enum(['good', 'needs-improvement', 'poor']).optional(),
  status: z.string().optional(),
  url: z.string().url(),
  pathname: z.string().startsWith('/'),
  timestamp: z.string().datetime().optional(),
  userAgent: z.string().max(500).optional(),
  memory: z.object({
    usedJSHeapSize: z.number().nonnegative(),
    totalJSHeapSize: z.number().nonnegative(),
    jsHeapSizeLimit: z.number().nonnegative(),
  }).optional(),
})

// In-memory metrics storage (for development)
const metricsStorage: MetricsPayload[] = []
const MAX_METRICS = 1000

export const POST = withErrorHandling(async (request: NextRequest): Promise<NextResponse> => {
  const raw: unknown = await request.json()
  const parsed = MetricsPayloadSchema.safeParse(raw)

  if (!parsed.success) {
    throw ApiError.badRequest('Invalid metrics payload', parsed.error.flatten())
  }

  const body = parsed.data

  const metric: MetricsPayload = {
    name: body.name,
    value: body.value,
    id: body.id || `${body.name}-${Date.now()}`,
    rating: body.rating,
    url: body.url,
    pathname: body.pathname,
    timestamp: body.timestamp || new Date().toISOString(),
    userAgent: body.userAgent || request.headers.get('user-agent') || '',
    memory: body.memory,
  }

  // Store metric (with size limit)
  metricsStorage.push(metric)
  if (metricsStorage.length > MAX_METRICS) {
    metricsStorage.shift()
  }

  // TODO: Send to external service
  // - Vercel Analytics
  // - DataDog
  // - New Relic
  // - Custom analytics service

  return createSuccessResponse({ receivedId: metric.id }, 200)
})

/**
 * GET /api/metrics?pathFilter=/about&metric=LCP
 * Retrieve stored metrics (for monitoring dashboard)
 */
export async function GET(request: NextRequest) {
  // Only allow in development or with auth token in production
  if (process.env.NODE_ENV === 'production') {
    const authToken = request.headers.get('authorization')
    if (!authToken || authToken !== `Bearer ${process.env.METRICS_API_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const { searchParams } = new URL(request.url)
  const pathFilter = searchParams.get('pathFilter')
  const metricName = searchParams.get('metric')
  const limit = parseInt(searchParams.get('limit') || '100', 10)

  // Filter metrics
  let filtered = metricsStorage

  if (pathFilter) {
    filtered = filtered.filter(m => m.pathname === pathFilter)
  }

  if (metricName) {
    filtered = filtered.filter(m => m.name === metricName)
  }

  // Calculate statistics
  const stats = calculateMetricsStats(filtered)

  return NextResponse.json({
    count: filtered.length,
    metrics: filtered.slice(-limit),
    stats,
  })
}

/**
 * Calculate statistics from metrics
 */
function calculateMetricsStats(metrics: MetricsPayload[]) {
  if (metrics.length === 0) {
    return {}
  }

  const groupedByName: Record<string, number[]> = {}

  for (const metric of metrics) {
    if (!groupedByName[metric.name]) {
      groupedByName[metric.name] = []
    }
    groupedByName[metric.name].push(metric.value)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stats: Record<string, any> = {}

  for (const [name, values] of Object.entries(groupedByName)) {
    const sorted = [...values].sort((a, b) => a - b)
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const p50 = sorted[Math.floor(sorted.length * 0.5)]
    const p75 = sorted[Math.floor(sorted.length * 0.75)]
    const p95 = sorted[Math.floor(sorted.length * 0.95)]

    stats[name] = {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      mean: Math.round(mean * 100) / 100,
      p50,
      p75,
      p95,
    }
  }

  return stats
}
