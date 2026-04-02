'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Capture the error in Sentry with context
        Sentry.captureException(error, {
            tags: {
                component: 'error-boundary',
                digest: error.digest,
            },
            contexts: {
                react: {
                    Error: error.message,
                },
            },
        });
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
            <div className="max-w-md w-full space-y-8 text-center">
                {/* Error Icon */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Oops! Something went wrong
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        An unexpected error occurred. Our team has been notified and is working to fix it.
                    </p>
                </div>

                {/* Error Details (Development Only) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg text-left">
                        <h2 className="font-mono text-sm font-bold text-red-700 dark:text-red-400 mb-2">
                            Error Details:
                        </h2>
                        <p className="font-mono text-xs text-red-600 dark:text-red-300 break-words">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="font-mono text-xs text-red-600 dark:text-red-300 mt-2">
                                <span className="font-bold">Digest:</span> {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center pt-4">
                    <Button
                        onClick={reset}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Try Again
                    </Button>
                    <Button
                        onClick={() => window.location.href = '/'}
                        variant="outline"
                        className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                        Back Home
                    </Button>
                </div>

                {/* Support Info */}
                <p className="text-xs text-gray-500 dark:text-gray-500 pt-4">
                    Error ID: {error.digest || 'unknown'}
                </p>
            </div>
        </div>
    );
}
