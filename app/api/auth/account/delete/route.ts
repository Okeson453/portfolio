import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server';
import { deleteAccountSchema } from '@/lib/validators/authSchema';
import { getSession } from '@/lib/auth/session';
import { deleteAccount } from '@/lib/auth/accountDeletion';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';
import { ZodError } from 'zod';

export const runtime = 'edge';

export const POST = withErrorHandling(async (req: NextRequest): Promise<NextResponseType> => {
    const session = await getSession();

    if (!session) {
        throw ApiError.unauthorized('Authentication required');
    }

    const body = await req.json();
    const validated = deleteAccountSchema.parse(body);

    await deleteAccount(session.userId, validated.password);

    return createSuccessResponse({ success: true });
});
