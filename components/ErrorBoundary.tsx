/**
 * @file components/ErrorBoundary.tsx
 * @description React Error Boundary for component-level error handling
 * @enterprise Isolates component errors to prevent cascading failures
 */

'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean;
  enableLogging?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary: Catches errors in child components
 * Prevents entire app from crashing due to component errors
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Call onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Log for debugging
    if (this.props.enableLogging ?? process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Caught error:', error);
      console.error('[ErrorBoundary] Error info:', errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default fallback UI
      return (
        <div
          role="alert"
          className="p-4 rounded-lg border border-red-800 bg-red-950/50 text-red-200"
        >
          <h2 className="font-semibold text-red-100 mb-2">
            Something went wrong in this section
          </h2>
          <details className="mb-3 text-sm text-red-300">
            <summary className="cursor-pointer font-medium">Error details</summary>
            <pre className="mt-2 p-2 bg-black/30 rounded text-xs overflow-auto max-h-24">
              {this.state.error.message}
            </pre>
          </details>
          <button
            onClick={this.resetError}
            className="px-3 py-1 text-sm font-medium bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap a component with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  { fallback, onError }: Omit<ErrorBoundaryProps, 'children'> = {}
): React.ComponentType<P> {
  const Wrapped = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  Wrapped.displayName = `WithErrorBoundary(${Component.displayName ?? Component.name ?? 'Component'})`;

  return Wrapped;
}

/**
 * Async Error Boundary variant for Suspense boundaries
 */
export class AsyncErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);

    if (process.env.NODE_ENV === 'development') {
      console.error('[AsyncErrorBoundary] Caught async error:', error);
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-lg border border-amber-800 bg-amber-950/50 text-amber-200">
          <p className="text-sm font-medium">Loading failed. Please refresh and try again.</p>
          <button
            onClick={this.resetError}
            className="mt-2 px-3 py-1 text-sm bg-amber-700 hover:bg-amber-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
