import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyTOTP, verifyRecoveryCode } from '@/lib/auth/twoFactor';
import { createSession } from '@/lib/auth/session';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

export const runtime = 'edge';

export const POST = withErrorHandling(async (req: NextRequest): Promise<NextResponseType> => {
    const body = await req.json();
    const { userId, code, useRecoveryCode } = body;

    if (!userId || !code) {
        throw ApiError.badRequest('Missing userId or code');
    }

    // Validate code format
    if (!/^\d{6}$/.test(code) && !useRecoveryCode) {
        throw ApiError.badRequest('Invalid code format');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorEnabled) {
        throw ApiError.badRequest('Invalid request');
    }

    let verified = false;

    if (useRecoveryCode) {
        verified = await verifyRecoveryCode(userId, code);
    } else {
        verified = await verifyTOTP(userId, code);
    }

    if (!verified) {
        throw ApiError.unauthorized('Invalid code');
    }

    // Create session after 2FA verified
    await createSession(userId);

    return createSuccessResponse({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    });
});
