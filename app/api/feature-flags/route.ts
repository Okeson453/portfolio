import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/feature-flags
 * Returns feature flag configuration for the client
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const flagName = searchParams.get('flag');
    const userId = searchParams.get('userId');

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
      return NextResponse.json({
        flag: flagName,
        isEnabled: featureFlags[flagName] ?? false,
      });
    }

    // Return all flags
    return NextResponse.json(featureFlags);
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature flags' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/feature-flags
 * Admin endpoint to update feature flags
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication here
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || !isValidAdminToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { flag, value } = body;

    if (!flag) {
      return NextResponse.json(
        { error: 'Flag name required' },
        { status: 400 }
      );
    }

    // In production, save to database/cache
    // For now, just acknowledge
    return NextResponse.json({
      success: true,
      flag,
      value,
      message: 'Feature flag updated',
    });
  } catch (error) {
    console.error('Error updating feature flag:', error);
    return NextResponse.json(
      { error: 'Failed to update feature flag' },
      { status: 500 }
    );
  }
}

/**
 * Simple token validation (replace with real auth)
 */
function isValidAdminToken(token: string): boolean {
  // In production, verify JWT token
  return token === process.env.ADMIN_API_TOKEN_SECRET;
}
