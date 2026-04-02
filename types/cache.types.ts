/**
 * Cache system type definitions
 */

export interface CacheEntry<T = unknown> {
  value: T;
  expiresAt?: number;
  metadata?: Record<string, unknown>;
}

export interface CacheOptions {
  ttl?: number;
  prefix?: string;
  compress?: boolean;
}

export interface CacheAdapter {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(prefix?: string): Promise<void>;
  has(key: string): Promise<boolean>;
}

export type CacheKey = string;
export type CacheTTL = number;
