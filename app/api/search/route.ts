import { NextRequest, NextResponse } from 'next/server';
import { mockAlgoliaSearch } from '@/lib/mocks';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

export const runtime = 'edge';

export const GET = withErrorHandling(async (req: NextRequest): Promise<NextResponse> => {
  const query = req.nextUrl.searchParams.get('q');

  if (!query || query.length < 2) {
    throw ApiError.badRequest('Query must be at least 2 characters');
  }

  // Use Algolia (or mock)
  const results = await mockAlgoliaSearch(query);

  return createSuccessResponse(results);
});
