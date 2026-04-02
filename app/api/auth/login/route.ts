import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators/authSchema';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { ZodError } from 'zod';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        // Check rate limit
        const rateLimited = await checkRateLimit(req, 'auth');
        if (!rateLimited) {
            return NextResponse.json(
                { error: 'Too many login attempts. Try again later.' },
                { status: 429 }
            );
        }

        const body = await req.json();
        const validated = loginSchema.parse(body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: validated.email },
        });

        if (!user || !user.passwordHash) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const passwordValid = await verifyPassword(validated.password, user.passwordHash);
        if (!passwordValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
            return NextResponse.json(
                { success: true, needs2FA: true, userId: user.id },
                { status: 200 }
            );
        }

        // Create session
        await createSession(user.id);

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (err) {
        console.error('[/api/auth/login]', err);

        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: 'Validation error' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
    }
}

