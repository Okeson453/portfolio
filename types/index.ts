/**
 * @file types/index.ts
 * @description Single source of truth for all shared domain types.
 *              Zero `any` tolerance. All types must be explicit and validated.
 * @enterprise Enterprise-grade TypeScript strict mode compliance
 */

import type React from 'react';

// ─── UI Components ────────────────────────────────────────────────────────────

export interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

// ─── Search ──────────────────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  score: number;
  publishedAt: string;
  type?: 'blog' | 'project' | 'page';
}

export interface SearchHitsResponse {
  hits: SearchResult[];
  totalCount: number;
  query: string;
  durationMs: number;
}

export interface SearchPayload {
  q: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

// ─── Metrics ─────────────────────────────────────────────────────────────────

export interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export interface MetricsPayload {
  name: string;
  value: number;
  id?: string;
  rating?: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  url: string;
  pathname: string;
  timestamp: string;
  userAgent: string;
  memory?: MemoryInfo;
}

export interface MetricsResponse {
  ok: boolean;
  recordedAt: string;
  ttl?: number;
}

// ─── Realtime ────────────────────────────────────────────────────────────────

export type RealtimeMessageType = 'comment' | 'update' | 'notification' | 'error' | 'heartbeat';

export interface RealtimeMessage {
  room: string;
  type: RealtimeMessageType;
  payload: Record<string, unknown>;
  timestamp: number;
  senderId?: string;
  version?: string;
}

export interface RealtimeConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';
  isConnected: boolean;
  lastConnectedAt?: Date;
  reconnectAttempt?: number;
  error?: Error;
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export interface BlogEmailStats {
  totalSubscribers: number;
  sentThisMonth: number;
  openRate: number;
  clickRate: number;
  scheduledCount: number;
  lastSentAt?: string;
}

export interface EmailRecord {
  id: string;
  subject: string;
  sentAt: string;
  recipientCount: number;
  openRate: number;
  clickRate?: number;
  scheduleId?: string;
}

export interface BlogEmailSchedule {
  id: string;
  postId: string;
  postTitle: string;
  subject: string;
  body: string;
  scheduledTime: string;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  featured: boolean;
  readTime?: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  approved: boolean;
  replies?: Comment[];
}

// ─── Drag Reorder ────────────────────────────────────────────────────────────

export interface DragReorderItem {
  id: string | number;
}

export interface DragReorderState<T extends DragReorderItem> {
  items: T[];
  draggedIndex: number | null;
  targetIndex: number | null;
  isDragging: boolean;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export type ThemeType = 'light' | 'dark' | 'system';
export type EmailFrequency = 'daily' | 'weekly' | 'never';

export interface UserSettings {
  theme: ThemeType;
  language: string;
  notificationsEnabled: boolean;
  emailDigestFrequency: EmailFrequency;
  analyticsOptIn: boolean;
  autoSaveInterval?: number;
  defaultViewMode?: 'grid' | 'list';
  compactMode?: boolean;
}

// ─── Contact Form ────────────────────────────────────────────────────────────

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
  phone?: string;
  recaptchaToken?: string;
}

export interface ContactFormResponse {
  success: boolean;
  messageId?: string;
  timestamp: string;
  error?: string;
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  statusCode: number;
  details?: unknown;
  requestId?: string;
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Comments API ────────────────────────────────────────────────────────────

export interface CreateCommentPayload {
  postId: string;
  author: string;
  email: string;
  content: string;
  parentId?: string;
  recaptchaToken?: string;
}

export interface GetCommentsQuery {
  postId: string;
  approved?: boolean;
  limit?: number;
  offset?: number;
}

// ─── Chat/Security Widget ────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  error?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

// ─── Authentication ──────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// ─── Rate Limiting ───────────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator: (req: unknown) => string;
  onLimitExceeded?: (key: string) => Promise<void>;
}

// ─── Error Handling ──────────────────────────────────────────────────────────

export interface ErrorReport {
  message: string;
  digest?: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent?: string;
  context?: Record<string, unknown>;
}

export interface AppError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;
  isOperational: boolean;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ─── Feature Flags ───────────────────────────────────────────────────────────

export interface FeatureFlagValue {
  enabled: boolean;
  percentage?: number;
  config?: Record<string, unknown>;
}

export type FeatureFlags = Record<string, FeatureFlagValue>;

// ─── CMS/Content ─────────────────────────────────────────────────────────────

export interface ContentMetadata {
  version: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
}

// ─── Form States ─────────────────────────────────────────────────────────────

export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  values: Record<string, unknown>;
}

// ─── Export constraints for stricter checking ─────────────────────────────────

/**
 * Ensures that DragReorderItem is properly generic
 * Usage: const hook = useDragReorder<SpecificType>(items);
 */
export function validateDragItem<T extends DragReorderItem>(item: T): T {
  if (!item.id) throw new Error('DragReorderItem.id is required');
  return item;
}
