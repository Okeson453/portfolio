/**
 * Web vitals and performance metrics type definitions
 */

// Use NextWebVitalsMetric from next/app instead of web-vitals package
// which is not installed and not necessary for Next.js integration

export interface MetricData {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
  entries?: PerformanceEntry[];
}

export type MetricHandler = (metric: MetricData) => void;

export interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  inp?: number;
}

export interface AnalyticsPayload {
  metrics: PerformanceMetrics;
  timestamp: number;
  sessionId: string;
  userAgent: string;
}
