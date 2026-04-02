'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseFeatureFlagOptions {
  defaultValue?: boolean;
  userId?: string;
}

/**
 * Custom hook for feature flag management
 * Fetches feature flags from API with client-side caching
 *
 * @param flagName - Name of the feature flag
 * @param options - Configuration options
 * @returns Whether the feature is enabled
 *
 * @example
 * const isNewUIEnabled = useFeatureFlag('new-ui-v2');
 * return isNewUIEnabled ? <NewUI /> : <OldUI />;
 */
export function useFeatureFlag(
  flagName: string,
  options: UseFeatureFlagOptions = {}
): boolean {
  const { defaultValue = false, userId } = options;
  const [isEnabled, setIsEnabled] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  const cacheKey = `feature-flag-${flagName}`;

  useEffect(() => {
    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached !== null) {
      try {
        const { value, timestamp } = JSON.parse(cached);
        // Cache valid for 5 minutes
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setIsEnabled(value);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing cached feature flag:', error);
      }
    }

    // Fetch from API
    const fetchFlag = async () => {
      try {
        const params = new URLSearchParams([['flag', flagName]]);
        if (userId) params.append('userId', userId);

        const response = await fetch(`/api/feature-flags?${params}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setIsEnabled(data.isEnabled);

          // Cache the result
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              value: data.isEnabled,
              timestamp: Date.now(),
            })
          );
        }
      } catch (error) {
        console.error('Error fetching feature flag:', error);
        setIsEnabled(defaultValue);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlag();
  }, [flagName, defaultValue, userId, cacheKey]);

  return isEnabled;
}
