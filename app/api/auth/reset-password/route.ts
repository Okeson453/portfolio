import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server';
import { resetPasswordSchema } from '@/lib/validators/authSchema';
import { validateResetToken, resetPassword } from '@/lib/auth/passwordReset';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';
import { ZodError } from 'zod';

export const runtime = 'edge';

export const POST = withErrorHandling(async (req: NextRequest): Promise<NextResponseType> => {
    const body = await req.json();
    const validated = resetPasswordSchema.parse(body);

    // Validate token
    const userId = await validateResetToken(validated.token);
    if (!userId) {
        throw ApiError.badRequest('Invalid or expired reset token');
    }

    // Reset password
    await resetPassword(validated.token, validated.password);

    return createSuccessResponse({ success: true });
});
