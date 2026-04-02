import { NextRequest, NextResponse } from 'next/server';
import { deleteAccountSchema } from '@/lib/validators/authSchema';
import { getSession } from '@/lib/auth/session';
import { deleteAccount } from '@/lib/auth/accountDeletion';
import { ZodError } from 'zod';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validated = deleteAccountSchema.parse(body);

        await deleteAccount(session.userId, validated.password);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[/api/auth/account/delete]', err);

        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: 'Validation error' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to delete account' },
            { status: 500 }
        );
    }
}
