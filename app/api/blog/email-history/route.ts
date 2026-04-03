import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server';
import { prisma } from '@/lib/db';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

/**
 * GET /api/blog/email-history?subscriberId=...&postId=...
 * Get email sending history
 */
export const GET = withErrorHandling(async (request: NextRequest): Promise<NextResponseType> => {
    const subscriberId = request.nextUrl.searchParams.get('subscriberId');
    const postId = request.nextUrl.searchParams.get('postId');
    const limit = request.nextUrl.searchParams.get('limit') || '50';

    const where: Record<string, unknown> = {};
    if (subscriberId) where.subscriberId = subscriberId;
    if (postId) where.postId = postId;

    const history = await prisma.emailHistory.findMany({
        where,
        orderBy: { sentAt: 'desc' },
        take: parseInt(limit),
        include: {
            subscriber: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            },
        },
    });

    return createSuccessResponse(history);
});

/**
 * POST /api/blog/email-history/track
 * Track email engagement (opens, clicks)
 */
export const POST = withErrorHandling(async (request: NextRequest): Promise<NextResponseType> => {
    const { emailHistoryId, event } = await request.json();

    if (!emailHistoryId || !event) {
        throw ApiError.badRequest('Missing required fields');
    }

    const update: Record<string, unknown> = {};

    if (event === 'open') {
        update.openedAt = new Date();
        update.status = 'opened';
    } else if (event === 'click') {
        update.clickedAt = new Date();
        update.status = 'clicked';
    }

    const updated = await prisma.emailHistory.update({
        where: { id: emailHistoryId },
        data: update,
    });

    return createSuccessResponse(updated);
});
export async function getEmailStats() {
    try {
        const stats = await prisma.emailHistory.groupBy({
            by: ['status'],
            _count: {
                id: true,
            },
        });

        const totalSent = await prisma.emailHistory.count();
        const totalOpened = await prisma.emailHistory.count({
            where: { status: 'opened' },
        });
        const totalClicked = await prisma.emailHistory.count({
            where: { status: 'clicked' },
        });

        return {
            totalSent,
            totalOpened,
            totalClicked,
            openRate: totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(2) : '0',
            clickRate: totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(2) : '0',
            statusBreakdown: stats,
        };
    } catch (error) {
        console.error('Stats error:', error);
        throw error;
    }
}
