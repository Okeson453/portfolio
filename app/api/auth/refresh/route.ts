/**
 * POST /api/auth/refresh
 *
 * Exchange an old refresh token for new access and refresh tokens
 * Implements 15-minute sliding window rotation
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rotateRefreshToken } from '@/lib/auth/refreshToken'
import { signJWT } from '@/lib/auth/jwt'
import { handleError, successResponse } from '@/lib/api/errors'
import { getLogger } from '@/lib/monitoring/logger'

const logger = getLogger()

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { refreshToken } = refreshSchema.parse(body)

    // Extract user ID from request (should be set in middleware during token validation)
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'User context missing' } },
        { status: 401 }
      )
    }

    // Rotate the refresh token (validates old token and creates new one)
    const rotationResult = await rotateRefreshToken(userId, refreshToken)

    if (!rotationResult.success) {
      logger.warn('Token rotation failed', {
        userId,
        error: rotationResult.error,
      })

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: rotationResult.error || 'Token rotation failed',
          },
        },
        { status: 401 }
      )
    }

    // Generate new JWT access token
    const accessToken = await signJWT(
      { userId, role: 'user' },
      { expiresIn: '1h' }
    )

    logger.auth('token_refresh', userId, {
      rotated: true,
    })

    return NextResponse.json(
      successResponse({
        accessToken,
        refreshToken: rotationResult.newToken,
        tokenType: 'Bearer',
        expiresIn: 3600, // 1 hour in seconds
      }),
      {
        status: 200,
        headers: {
          // Secure HTTP-only cookie for refresh token
          'Set-Cookie': `refreshToken=${rotationResult.newToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
        },
      }
    )
  } catch (err) {
    const { status, response } = handleError(err, '/api/auth/refresh')
    return NextResponse.json(response, { status })
  }
}
