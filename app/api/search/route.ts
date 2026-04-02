import { NextRequest, NextResponse } from 'next/server';
import { mockAlgoliaSearch } from '@/lib/mocks';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Query too short' },
        { status: 400 }
      );
    }

    // Use Algolia (or mock)
    const results = await mockAlgoliaSearch(query);

    return NextResponse.json(results);
  } catch (err) {
    console.error('[/api/search]', err);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
