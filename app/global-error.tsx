'use client';

import * as Sentry from '@sentry/nextjs';
import { AlertTriangle } from 'lucide-react';

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Global error boundary for root layout and Next.js internals
 * This catches errors that occur at the application root level
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
    // Capture in Sentry
    Sentry.captureException(error, {
        tags: {
            component: 'global-error-boundary',
            digest: error.digest,
        },
    });

    return (
        <html>
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    padding: '1rem',
                }}>
                    <div style={{
                        maxWidth: '28rem',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        textAlign: 'center',
                    }}>
                        {/* Error Icon */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                            <div style={{
                                width: '4rem',
                                height: '4rem',
                                backgroundColor: '#fee2e2',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <AlertTriangle style={{
                                    width: '2rem',
                                    height: '2rem',
                                    color: '#dc2626',
                                }} />
                            </div>
                        </div>

                        {/* Error Message */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                        }}>
                            <h1 style={{
                                fontSize: '1.875rem',
                                fontWeight: 'bold',
                                color: '#111827',
                            }}>
                                Critical Error
                            </h1>
                            <p style={{
                                color: '#4b5563',
                                fontSize: '1rem',
                            }}>
                                The application encountered a critical error and needs to restart.
                                Our team has been notified.
                            </p>
                        </div>

                        {/* Error Details (Development) */}
                        {process.env.NODE_ENV === 'development' && (
                            <div style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                backgroundColor: '#fef2f2',
                                borderRadius: '0.5rem',
                                textAlign: 'left',
                                border: '1px solid #fecaca',
                            }}>
                                <h2 style={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold',
                                    color: '#b91c1c',
                                    marginBottom: '0.5rem',
                                }}>
                                    Error Details:
                                </h2>
                                <p style={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.75rem',
                                    color: '#dc2626',
                                    wordBreak: 'break-word',
                                }}>
                                    {error.message}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            paddingTop: '1rem',
                        }}>
                            <button
                                onClick={reset}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#2563eb',
                                    color: '#fff',
                                    borderRadius: '0.375rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#fff',
                                    color: '#4b5563',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #d1d5db',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                            >
                                Home
                            </button>
                        </div>

                        {/* Support Info */}
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#9ca3af',
                            paddingTop: '1rem',
                        }}>
                            Incident ID: {error.digest || 'unknown'}
                        </p>
                    </div>
                </div>
            </body>
        </html>
    );
}
