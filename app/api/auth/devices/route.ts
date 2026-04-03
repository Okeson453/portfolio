import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

export const runtime = 'edge';

export const GET = withErrorHandling(async (): Promise<NextResponseType> => {
    const session = await getSession();

    if (!session) {
        throw ApiError.unauthorized('Authentication required');
    }

    const devices = await prisma.device.findMany({
        where: { userId: session.userId },
        select: {
            id: true,
            userAgent: true,
            ipAddress: true,
            lastActivityAt: true,
            createdAt: true,
        },
        orderBy: { lastActivityAt: 'desc' },
    });

    return createSuccessResponse({ devices });
});

export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const deviceId = req.nextUrl.searchParams.get('id');

        if (!deviceId) {
            return NextResponse.json(
                { error: 'Missing device id' },
                { status: 400 }
            );
        }

        // Verify device belongs to user
        const device = await prisma.device.findUnique({
            where: { id: deviceId },
        });

        if (!device || device.userId !== session.userId) {
            return NextResponse.json(
                { error: 'Device not found' },
                { status: 404 }
            );
        }

        // Delete device
        await prisma.device.delete({ where: { id: deviceId } });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[/api/auth/devices DELETE]', err);
        return NextResponse.json(
            { error: 'Failed to revoke device' },
            { status: 500 }
        );
    }
}
