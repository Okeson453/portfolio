'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Skeleton card that matches blog card layout
export function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-lg border border-muted bg-muted p-6">
            <div className="mb-4 h-48 w-full rounded-md bg-muted-foreground/20" />
            <div className="mb-3 h-4 w-3/4 rounded bg-muted-foreground/20" />
            <div className="mb-3 h-4 w-full rounded bg-muted-foreground/20" />
            <div className="h-4 w-1/2 rounded bg-muted-foreground/20" />
        </div>
    );
}

// Skeleton for table rows
export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
    return (
        <tr className="animate-pulse border-b">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 w-full rounded bg-muted-foreground/20" />
                </td>
            ))}
        </tr>
    );
}

// Skeleton text (for paragraphs)
export function SkeletonText({
    lines = 3,
    className,
}: {
    lines?: number;
    className?: string;
}) {
    return (
        <div className={cn('animate-pulse space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        'h-4 rounded bg-muted-foreground/20',
                        i === lines - 1 && 'w-3/4'
                    )}
                />
            ))}
        </div>
    );
}

// Skeleton for dashboard card
export function SkeletonDashboardCard() {
    return (
        <div className="animate-pulse rounded-lg border border-muted bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
                <div className="h-6 w-1/3 rounded bg-muted-foreground/20" />
                <div className="h-8 w-8 rounded bg-muted-foreground/20" />
            </div>
            <div className="mb-2 h-8 w-1/2 rounded bg-muted-foreground/20" />
            <div className="h-4 w-full rounded bg-muted-foreground/20" />
        </div>
    );
}

// Skeleton for button
export function SkeletonButton() {
    return <div className="h-10 w-full animate-pulse rounded-md bg-muted-foreground/20" />;
}

// Skeleton for badge/tag
export function SkeletonBadge() {
    return <div className="h-6 w-16 animate-pulse rounded-full bg-muted-foreground/20" />;
}
