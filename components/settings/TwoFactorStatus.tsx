'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface TwoFactorStatusProps {
    enabled: boolean;
}

export function TwoFactorStatus({ enabled }: TwoFactorStatusProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-medium">
                    {enabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
                </p>
                <p className="text-sm text-muted-foreground">
                    {enabled
                        ? 'Your account has an extra layer of security'
                        : 'Protect your account with an extra layer of security'}
                </p>
            </div>
            <Button asChild>
                <Link href="/settings/security/two-factor">
                    {enabled ? 'Manage' : 'Enable'}
                </Link>
            </Button>
        </div>
    );
}
