import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators/authSchema';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

export const runtime = 'edge';

export const POST = withErrorHandling(async (req: NextRequest): Promise<NextResponse> => {
    // Check rate limit
    const rateLimited = await checkRateLimit(req, 'auth');
    if (!rateLimited) {
        throw ApiError.tooManyRequests();
    }

    const body = await req.json();
    const validated = loginSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
        where: { email: validated.email },
    });

    if (!user || !user.passwordHash) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    // Verify password
    const passwordValid = await verifyPassword(validated.password, user.passwordHash);
    if (!passwordValid) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
        return createSuccessResponse({
            success: true,
            needs2FA: true,
            userId: user.id,
        });
    }

    // Create session
    await createSession(user.id);

    return createSuccessResponse({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    });
});
    }
}

