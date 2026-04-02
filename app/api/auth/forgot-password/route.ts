import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/lib/validators/authSchema';
import { requestPasswordReset } from '@/lib/auth/passwordReset';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { ZodError } from 'zod';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        // Check rate limit
        const rateLimited = await checkRateLimit(req, 'passwordReset');
        if (!rateLimited) {
            return NextResponse.json(
                { error: 'Too many password reset requests. Try again later.' },
                { status: 429 }
            );
        }

        const body = await req.json();
        const validated = forgotPasswordSchema.parse(body);

        // Request password reset (no user enumeration)
        await requestPasswordReset(validated.email);

        // Always return success to prevent user enumeration
        return NextResponse.json({
            success: true,
            message: 'If an account exists, a password reset link has been sent.',
        });
    } catch (err) {
        console.error('[/api/auth/forgot-password]', err);

        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: 'Validation error' },
                { status: 400 }
            );
        }

        // Don't expose error details
        return NextResponse.json({
            success: true,
            message: 'If an account exists, a password reset link has been sent.',
        });
    }
}
