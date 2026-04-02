'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook for detecting offline/online status
 * Updates on network status changes
 *
 * @returns Whether the user is currently online
 *
 * @example
 * const isOnline = useOfflineStatus();
 * return (
 *   <>
 *     {!isOnline && <OfflineBanner />}
 *   </>
 * );
 */
export function useOfflineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
