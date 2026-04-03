import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

/**
 * GET /api/feature-flags
 * Returns feature flag configuration for the client
 */
export const GET = withErrorHandling(async (request: NextRequest): Promise<NextResponse> => {
  const searchParams = request.nextUrl.searchParams;
  const flagName = searchParams.get('flag');

  // In production, you'd fetch from database or feature flag service
  // For now, return a default configuration
  const featureFlags: Record<string, boolean> = {
    'new-ui-v2': true,
    'infinite-scroll': true,
    'real-time-comments': true,
    'draft-autosave': true,
    'command-palette': true,
    'offline-mode': true,
    'a-b-test-variant-1': Math.random() > 0.5, // Simple A/B testing
  };

  if (flagName) {
    // Return specific flag
    return createSuccessResponse({
      flag: flagName,
      isEnabled: featureFlags[flagName] ?? false,
    });
  }

  // Return all flags
  return createSuccessResponse(featureFlags);
});

/**
 * POST /api/feature-flags
 * Admin endpoint to update feature flags
 */
export const POST = withErrorHandling(async (request: NextRequest): Promise<NextResponse> => {
  // Verify admin authentication here
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token || !isValidAdminToken(token)) {
    throw ApiError.unauthorized('Invalid admin token');
  }

  const body = await request.json();
  const { flag, value } = body;

  if (!flag) {
    throw ApiError.badRequest('Flag name is required');
  }

  // In production, save to database/cache
  // For now, just acknowledge
  return createSuccessResponse({
    success: true,
    flag,
    value,
    message: 'Feature flag updated',
  });
});

/**
 * Simple token validation (replace with real auth)
 */
function isValidAdminToken(token: string): boolean {
  // In production, verify JWT token
  return token === process.env.ADMIN_API_TOKEN_SECRET;
}
