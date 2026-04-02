import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SettingsCardProps {
    title?: string;
    description?: string;
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'destructive';
}

export function SettingsCard({
    title,
    description,
    children,
    className,
    variant = 'default',
}: SettingsCardProps) {
    return (
        <div
            className={cn(
                'rounded-lg border bg-card p-6 shadow-sm',
                variant === 'destructive' && 'border-destructive/50',
                className
            )}
        >
            {title && (
                <div className="mb-4">
                    <h3 className={cn('text-lg font-medium', variant === 'destructive' && 'text-destructive')}>
                        {title}
                    </h3>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            )}
            {children}
        </div>
    );
}

