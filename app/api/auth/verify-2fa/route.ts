import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyTOTP, verifyRecoveryCode } from '@/lib/auth/twoFactor';
import { createSession } from '@/lib/auth/session';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, code, useRecoveryCode } = body;

        if (!userId || !code) {
            return NextResponse.json(
                { error: 'Missing userId or code' },
                { status: 400 }
            );
        }

        // Validate code format
        if (!/^\d{6}$/.test(code) && !useRecoveryCode) {
            return NextResponse.json(
                { error: 'Invalid code format' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.twoFactorEnabled) {
            return NextResponse.json(
                { error: 'Invalid request' },
                { status: 400 }
            );
        }

        let verified = false;

        if (useRecoveryCode) {
            verified = await verifyRecoveryCode(userId, code);
        } else {
            verified = await verifyTOTP(userId, code);
        }

        if (!verified) {
            return NextResponse.json(
                { error: 'Invalid code' },
                { status: 401 }
            );
        }

        // Create session after 2FA verified
        await createSession(userId);

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (err) {
        console.error('[/api/auth/verify-2fa]', err);
        return NextResponse.json(
            { error: '2FA verification failed' },
            { status: 500 }
        );
    }
}
