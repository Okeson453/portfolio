'use client';

import { useEffect } from 'react';
import { initializePostHog } from '@/lib/monitoring/posthog';
import { initializeSentry } from '@/lib/monitoring/sentry';
import { registerServiceWorker } from '@/lib/client/swRegistration';
import { featureFlagManager } from '@/lib/client/featureFlags';

/**
 * Initialize all client-side services
 * Must be wrapped in 'use client' component
 */
export function ClientInitializer() {
  useEffect(() => {
    // Initialize monitoring
    initializeSentry();
    initializePostHog();

    // Initialize service worker for PWA
    registerServiceWorker();

    // Pre-fetch feature flags
    featureFlagManager.fetchFlags();

    // Set up periodic feature flag refresh
    const flagInterval = setInterval(() => {
      featureFlagManager.fetchFlags();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      clearInterval(flagInterval);
    };
  }, []);

  return null;
}
