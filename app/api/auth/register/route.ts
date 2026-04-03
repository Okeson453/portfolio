import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validators/authSchema';
import { registerUser } from '@/lib/auth/registration';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

export const runtime = 'edge';

export const POST = withErrorHandling(async (req: NextRequest): Promise<NextResponse> => {
    // Check rate limit
    const rateLimited = await checkRateLimit(req, 'register');
    if (!rateLimited) {
        throw ApiError.tooManyRequests();
    }

    const body = await req.json();

    // Validate input
    const validated = registerSchema.parse(body);

    // Register user
    const result = await registerUser({
        email: validated.email,
        password: validated.password,
        name: validated.name,
    });

    if (!result.success) {
        throw ApiError.badRequest(result.error || 'Registration failed');
    }

    return createSuccessResponse(
        { success: true, message: 'Check your email to verify your account' },
        201
    );
});
