import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/lib/validators/authSchema';
import { validateResetToken, resetPassword } from '@/lib/auth/passwordReset';
import { ZodError } from 'zod';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validated = resetPasswordSchema.parse(body);

        // Validate token
        const userId = await validateResetToken(validated.token);
        if (!userId) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Reset password
        await resetPassword(validated.token, validated.password);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[/api/auth/reset-password]', err);

        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: 'Validation error' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Password reset failed' },
            { status: 500 }
        );
    }
}
