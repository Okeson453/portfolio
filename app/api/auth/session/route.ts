import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // Get auth token from cookies
        const token = request.cookies.get('auth-token')?.value

        if (!token) {
            return NextResponse.json({ user: null }, { status: 401 })
        }

        // Mock session - in production, verify JWT token
        return NextResponse.json(
            {
                user: {
                    id: 'user-1',
                    email: 'user@example.com',
                    name: 'User Name',
                },
                token: token,
            },
            { status: 200 }
        )
    } catch (_error) {
        return NextResponse.json(
            { error: 'Failed to fetch session' },
            { status: 500 }
        )
    }
}
