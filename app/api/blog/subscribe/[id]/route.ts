import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';
import { z } from 'zod';

/**
 * GET /api/blog/subscribe/status?email=...
 * Check subscription status
 */
export const GET = withErrorHandling(async (request: NextRequest): Promise<NextResponseType> => {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
        throw ApiError.badRequest('Email parameter required');
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

    if (!subscriber) {
        throw ApiError.notFound('Subscriber');
    }

    return createSuccessResponse(subscriber);
});

/**
 * POST /api/blog/subscribe/[id]/unsubscribe
 * Unsubscribe from newsletter
 */
export const POST = withErrorHandling(async (
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponseType> => {
    const { email, reason } = await request.json();

    if (!email) {
        throw ApiError.badRequest('Email required');
    }

    const subscriber = await prisma.emailSubscriber.findUnique({
        where: { email },
    });

    if (!subscriber) {
        throw ApiError.notFound('Subscriber');
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

    return createSuccessResponse({ message: 'Unsubscribed successfully' });
});
