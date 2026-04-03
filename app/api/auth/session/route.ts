import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server'
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler'

export const GET = withErrorHandling(async (request: NextRequest): Promise<NextResponseType> => {
    // Get auth token from cookies
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
        throw ApiError.unauthorized('No session found')
    }

    // Mock session - in production, verify JWT token
    return createSuccessResponse({
        user: {
            id: 'user-1',
            email: 'user@example.com',
            name: 'User Name',
        },
        token: token,
    })
});
