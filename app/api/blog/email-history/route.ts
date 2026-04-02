import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/blog/email-history?subscriberId=...&postId=...
 * Get email sending history
 */
export async function GET(request: NextRequest) {
    try {
        const subscriberId = request.nextUrl.searchParams.get('subscriberId');
        const postId = request.nextUrl.searchParams.get('postId');
        const limit = request.nextUrl.searchParams.get('limit') || '50';

        const where: Record<string, any> = {};
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

        return NextResponse.json(history);
    } catch (error) {
        console.error('History fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}

/**
 * POST /api/blog/email-history/track
 * Track email engagement (opens, clicks)
 */
export async function POST(request: NextRequest) {
    try {
        const { emailHistoryId, event } = await request.json();

        if (!emailHistoryId || !event) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const update: Record<string, any> = {};

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

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Tracking error:', error);
        return NextResponse.json({ error: 'Failed to track engagement' }, { status: 500 });
    }
}

/**
 * GET /api/blog/email-stats
 * Get email campaign statistics
 */
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
