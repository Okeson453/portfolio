import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth/session';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    await destroySession();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[/api/auth/logout]', err);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
