'use client';

import React from 'react';
import { useOfflineStatus } from '@/hooks';
import { cn } from '@/lib/utils';

export function OfflineBanner() {
    const isOnline = useOfflineStatus();

    if (isOnline) return null;

    return (
        <div
            className={cn(
                'sticky top-0 z-50 w-full bg-yellow-500/10 px-4 py-3 text-center',
                'border-b border-yellow-500/20 backdrop-blur-sm'
            )}
            role="alert"
            aria-live="polite"
        >
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                You are currently offline. Some features may be limited. Changes will sync when back online.
            </p>
        </div>
    );
}
