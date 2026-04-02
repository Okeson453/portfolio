'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
                destructive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
    children: React.ReactNode;
    className?: string;
}

export function Badge({ variant, className, children, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant }), className)} {...props}>
            {children}
        </span>
    );
}
