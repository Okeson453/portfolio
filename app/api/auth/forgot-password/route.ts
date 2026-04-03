import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server';
import { forgotPasswordSchema } from '@/lib/validators/authSchema';
import { requestPasswordReset } from '@/lib/auth/passwordReset';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';
import { ZodError } from 'zod';

export const runtime = 'edge';

export const POST = withErrorHandling(async (req: NextRequest): Promise<NextResponseType> => {
    // Check rate limit
    const rateLimit = await checkRateLimit(req, 'passwordReset');
    if (!rateLimit.allowed) {
        throw ApiError.tooManyRequests();
    }

    const body = await req.json();
    const validated = forgotPasswordSchema.parse(body);

    // Request password reset (no user enumeration)
    await requestPasswordReset(validated.email);

    // Always return success to prevent user enumeration
    return createSuccessResponse({
        success: true,
        message: 'If an account exists, a password reset link has been sent.',
    });
});
