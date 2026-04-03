import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server';
import { verifyEmail } from '@/lib/auth/verification';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

export const runtime = 'edge';

export const GET = withErrorHandling(async (req: NextRequest): Promise<NextResponseType> => {
    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
        throw ApiError.badRequest('Missing verification token');
    }

    const success = await verifyEmail(token);

    if (!success) {
        throw ApiError.badRequest('Invalid or expired verification token');
    }

    return createSuccessResponse({ success: true });
});
