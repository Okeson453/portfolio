'use client';

import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { RealtimeMessage } from '@/types';

interface UseRealtimeOptions {
  url?: string;
  enabled?: boolean;
  onMessage?: (data: RealtimeMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

interface UseRealtimeReturn {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  send: (message: RealtimeMessage) => void;
  subscribe: (room: string, callback: (data: RealtimeMessage) => void) => () => void;
  unsubscribe: (room: string) => void;
}

/**
 * Custom hook for real-time updates via WebSocket
 * Manages Socket.IO connections for live data synchronization
 *
 * @param options - Configuration options
 * @returns Connection state and control methods
 *
 * @example
 * const { isConnected, subscribe } = useRealtime({
 *   onMessage: (data) => console.log('New message:', data),
 * });
 *
 * useEffect(() => {
 *   subscribe(`blog:${postId}`, (newComment) => {
 *     queryClient.invalidateQueries({ queryKey: ['comments', postId] });
 *   });
 * }, [postId]);
 */
export function useRealtime(options: UseRealtimeOptions = {}): UseRealtimeReturn {
  const {
    url = process.env.NEXT_PUBLIC_REALTIME_URL || 'http://localhost:3000',
    enabled = true,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [socket, setSocket] = useState<unknown>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    // Lazy-load Socket.IO client
    import('socket.io-client').then(({ io }) => {
      const newSocket = io(url, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        onConnect?.();
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        onDisconnect?.();
      });

      newSocket.on('error', (error: Error) => {
        onError?.(error);
      });

      if (onMessage) {
        newSocket.on('message', onMessage);
      }

      setSocket(newSocket);
    });

    return () => {
      socket?.disconnect();
    };
  }, [enabled, url, onMessage, onConnect, onDisconnect, onError]);

  const send = useCallback(
    (message: any) => {
      if (socket?.connected) {
        socket.emit('message', message);
      }
    },
    [socket]
  );

  const subscribe = useCallback(
    (room: string, callback: (data: any) => void) => {
      if (socket) {
        socket.on(room, callback);
      }
    },
    [socket]
  );

  const unsubscribe = useCallback(
    (room: string) => {
      if (socket) {
        socket.off(room);
      }
    },
    [socket]
  );

  return {
    isConnected,
    send,
    subscribe,
    unsubscribe,
  };
}
