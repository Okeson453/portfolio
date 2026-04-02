import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validators/authSchema';
import { registerUser } from '@/lib/auth/registration';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { ZodError } from 'zod';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        // Check rate limit
        const rateLimited = await checkRateLimit(req, 'register');
        if (!rateLimited) {
            return NextResponse.json(
                { error: 'Too many registration attempts. Please try again later.' },
                { status: 429 }
            );
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
            return NextResponse.json(
                { error: result.error || 'Registration failed' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Check your email to verify your account' },
            { status: 201 }
        );
    } catch (err) {
        console.error('[/api/auth/register]', err);

        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: err.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}
