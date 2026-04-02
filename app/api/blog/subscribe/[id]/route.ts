import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

/**
 * GET /api/blog/subscribe/status?email=...
 * Check subscription status
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const email = request.nextUrl.searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: 'Email parameter required' },
                { status: 400 }
            );
        }

        const subscriber = await prisma.emailSubscriber.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                preferences: true,
                verifiedAt: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            subscriber || { message: 'Not subscribed' },
            { status: subscriber ? 200 : 404 }
        );
    } catch (error) {
        console.error('Status check error:', error);
        return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
    }
}

/**
 * POST /api/blog/subscribe/[id]/unsubscribe
 * Unsubscribe from newsletter
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { email, reason } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email required' },
                { status: 400 }
            );
        }

        const subscriber = await prisma.emailSubscriber.findUnique({
            where: { email },
        });

        if (!subscriber) {
            return NextResponse.json(
                { error: 'Subscriber not found' },
                { status: 404 }
            );
        }

        await prisma.emailSubscriber.update({
            where: { email },
            data: {
                status: 'unsubscribed',
            },
        });

        if (reason) {
            // Log unsubscribe reason for analysis
            console.log(`Unsubscribe: ${email} - Reason: ${reason}`);
        }

        return NextResponse.json(
            { message: 'Unsubscribed successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
    }
}
