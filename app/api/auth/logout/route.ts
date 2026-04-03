import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth/session';
import { withErrorHandling, createSuccessResponse } from '@/lib/api/errorHandler';

export const runtime = 'edge';

export const POST = withErrorHandling(async (_req: NextRequest): Promise<NextResponse> => {
  await destroySession();
  return createSuccessResponse({ success: true });
});
