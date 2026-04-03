import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

export const runtime = 'edge';

export const GET = withErrorHandling(async (_req: NextRequest): Promise<NextResponse> => {
    const session = await getSession();

    if (!session) {
        throw ApiError.unauthorized('Authentication required');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            emailVerified: true,
            twoFactorEnabled: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw ApiError.notFound('User');
    }

    return createSuccessResponse({ user });
});
