'use client';

import React from 'react';
import { useFeatureFlag } from '@/hooks';

interface FeatureFlagWrapperProps {
    flag: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    userId?: string;
}

export function FeatureFlagWrapper({
    flag,
    children,
    fallback = null,
    userId,
}: FeatureFlagWrapperProps) {
    const isEnabled = useFeatureFlag(flag, { userId });

    return isEnabled ? <>{children}</> : <>{fallback}</>;
}
