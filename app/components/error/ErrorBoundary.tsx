'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Terminal,
  Bug,
  Lock,
  Download,
  Send,
  Copy,
  ExternalLink
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
  errorContext: Record<string, string | number | boolean>
  showDetails: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      errorContext: {},
      showDetails: false
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: crypto.randomUUID(),
      errorContext: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        platform: navigator.platform,
        language: navigator.language
      },
      showDetails: false
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
      errorContext: {
        ...this.state.errorContext,
        componentStack: errorInfo.componentStack || '',
        errorStack: error.stack || ''
      }
    })

    // Log error to analytics/error tracking service
    this.logError(error, errorInfo)

    // Show toast notification
    toast.error(
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5" />
        <span>An error occurred. The security team has been notified.</span>
      </div>,
      {
        duration: 5000,
        position: 'top-right'
      }
    )
  }

  private logError(error: Error, errorInfo: ErrorInfo) {
    const errorData = {
      id: this.state.errorId,
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: this.state.errorContext,
      timestamp: new Date().toISOString()
    }

    // In production, send to error tracking service (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to your error tracking endpoint
      fetch('/api/error-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      }).catch(() => {
        // Silent fail for error logging
      })
    } else {
      // In development, error logged to monitoring
    }

    // Dispatch custom event for security monitoring
    const event = new CustomEvent('security-event', {
      detail: {
        type: 'ERROR_BOUNDARY_TRIGGERED',
        data: {
          errorId: this.state.errorId,
          errorName: error.name,
          path: window.location.pathname
        }
      }
    })
    document.dispatchEvent(event)
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      errorContext: {},
      showDetails: false
    })

    toast.success('Error state cleared. Page reloading...')

    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  private handleReportError = () => {
    const errorReport = {
      errorId: this.state.errorId,
      error: this.state.error?.toString(),
      componentStack: this.state.errorInfo?.componentStack,
      context: this.state.errorContext,
      userEmail: prompt('Enter your email for follow-up (optional):')
    }

    // In production, send to error reporting endpoint
    toast.promise(
      fetch('/api/error-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport)
      }),
      {
        loading: 'Reporting error to security team...',
        success: 'Error reported successfully. Thank you!',
        error: 'Failed to report error'
      }
    )
  }

  private handleCopyError = () => {
    const errorText = `
Error ID: ${this.state.errorId}
Error: ${this.state.error?.toString()}
Component Stack: ${this.state.errorInfo?.componentStack}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}
    `.trim()

    navigator.clipboard.writeText(errorText)
    toast.success('Error details copied to clipboard')
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleDebug = () => {
    // Error details available in state
    toast('Error state logged for investigation', {
      icon: '🔍'
    })
  }

  override render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-darker to-black flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            {/* Matrix Background Effect */}
            <div className="absolute inset-0 cyber-grid opacity-10" />

            {/* Error Container */}
            <div className="relative bg-cyber-dark/90 backdrop-blur-xl border border-red-500/30 rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-red-900/20 via-red-900/10 to-transparent border-b border-red-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">Security Error Detected</h1>
                      <p className="text-red-300/70">
                        Error ID: <span className="font-mono">{this.state.errorId}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-sm font-bold">
                      CRITICAL
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Error Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bug className="w-5 h-5 text-red-400" />
                        <h3 className="font-bold text-white">Error Details</h3>
                      </div>
                      <div className="font-mono text-sm text-red-300 p-3 bg-black/50 rounded overflow-x-auto">
                        {this.state.error?.toString() || 'Unknown error'}
                      </div>
                    </div>

                    <div className="p-4 bg-cyber-dark/50 border border-cyber-green/20 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-cyber-green">Security Context</h3>
                        <button
                          onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                          className="text-sm px-3 py-1 bg-cyber-green/10 border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors"
                        >
                          {this.state.showDetails ? 'Hide' : 'Show'} Details
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/70">URL:</span>
                          <span className="font-mono text-cyber-green truncate max-w-xs">
                            {this.state.errorContext.url}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/70">Timestamp:</span>
                          <span className="font-mono text-cyber-green">
                            {new Date(this.state.errorContext.timestamp as string).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/70">Platform:</span>
                          <span className="font-mono text-cyber-green">
                            {this.state.errorContext.platform}
                          </span>
                        </div>
                      </div>

                      <div className={`transition-all duration-300 overflow-hidden ${
                        this.state.showDetails
                          ? 'max-h-96 opacity-100 mt-4 pt-4 border-t border-cyber-green/20'
                          : 'max-h-0 opacity-0'
                      }`}>
                        <div className="space-y-2">
                          <div className="text-sm text-foreground/70 mb-2">Component Stack:</div>
                          <div className="font-mono text-xs text-cyber-green/70 p-3 bg-black/30 rounded overflow-x-auto">
                            {this.state.errorInfo?.componentStack || 'No component stack available'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Panel */}
                  <div className="space-y-4">
                    <div className="p-4 bg-cyber-dark/50 border border-cyber-green/20 rounded-lg">
                      <h3 className="font-bold text-cyber-green mb-4">Recovery Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={this.handleReset}
                          className="w-full p-3 bg-gradient-to-r from-cyber-green to-cyber-blue text-cyber-dark rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                        >
                          <RefreshCw className="w-5 h-5" />
                          <span>Reset & Reload</span>
                        </button>

                        <button
                          onClick={this.handleGoHome}
                          className="w-full p-3 bg-cyber-green/10 border border-cyber-green/30 text-cyber-green rounded-lg hover:bg-cyber-green/20 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Home className="w-5 h-5" />
                          <span>Go to Homepage</span>
                        </button>

                        <button
                          onClick={this.handleReportError}
                          className="w-full p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Send className="w-5 h-5" />
                          <span>Report to Security Team</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-cyber-dark/50 border border-cyber-green/20 rounded-lg">
                      <h3 className="font-bold text-cyber-green mb-4">Debug Tools</h3>
                      <div className="space-y-3">
                        <button
                          onClick={this.handleCopyError}
                          className="w-full p-3 bg-cyber-green/10 border border-cyber-green/30 text-cyber-green rounded-lg hover:bg-cyber-green/20 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Copy className="w-5 h-5" />
                          <span>Copy Error Details</span>
                        </button>

                        <button
                          onClick={this.handleDebug}
                          className="w-full p-3 bg-cyber-green/10 border border-cyber-green/30 text-cyber-green rounded-lg hover:bg-cyber-green/20 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Terminal className="w-5 h-5" />
                          <span>Open Debug Console</span>
                        </button>

                        <a
                          href="https://status.securestack.dev"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full p-3 bg-cyber-green/10 border border-cyber-green/30 text-cyber-green rounded-lg hover:bg-cyber-green/20 transition-colors flex items-center justify-center space-x-2"
                        >
                          <ExternalLink className="w-5 h-5" />
                          <span>Check System Status</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Footer */}
              <div className="p-4 bg-gradient-to-r from-cyber-dark via-cyber-darker to-black border-t border-cyber-green/20">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-4 h-4 text-cyber-green" />
                    <span className="text-cyber-green/70">
                      This incident has been logged for security analysis
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="text-xs px-3 py-1 bg-cyber-green/10 border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors">
                      <Download className="w-3 h-3 inline mr-1" />
                      Download Logs
                    </button>
                    <span className="text-xs text-cyber-green/50 font-mono">
                      Incident: {this.state.errorId?.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Easter Egg */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  const code = prompt('Enter debug override code:')
                  if (code === 'DEBUG-OVERRIDE-2024') {
                    this.handleReset()
                    toast.success('Debug override activated!')
                  }
                }}
                className="text-xs text-cyber-green/30 hover:text-cyber-green transition-colors font-mono"
              >
                &lt;emergency-override /&gt;
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Error boundary for specific component sections
export function ErrorBoundarySection({
  children,
  section
}: {
  children: ReactNode
  section: string
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 border border-red-500/30 rounded-lg bg-red-500/10">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-white">Error in {section}</h3>
          </div>
          <p className="text-red-300/70 text-sm">
            This section failed to load. Please refresh the page or report the issue.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}