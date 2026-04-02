import { NextRequest, NextResponse } from 'next/server';
import { verifyEmail } from '@/lib/auth/verification';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const token = req.nextUrl.searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Missing verification token' },
                { status: 400 }
            );
        }

        const success = await verifyEmail(token);

        if (!success) {
            return NextResponse.json(
                { error: 'Invalid or expired verification token' },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[/api/auth/verify-email]', err);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}
