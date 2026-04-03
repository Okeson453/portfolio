/**
 * POST /api/auth/refresh
 *
 * Exchange an old refresh token for new access and refresh tokens
 * Implements 15-minute sliding window rotation
 */

import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server'
import { z } from 'zod'
import { rotateRefreshToken } from '@/lib/auth/refreshToken'
import { signJWT } from '@/lib/auth/jwt'
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler'
import { getLogger } from '@/lib/monitoring/logger'

const logger = getLogger()

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
})

export const POST = withErrorHandling(async (req: NextRequest): Promise<NextResponseType> => {
  const body = await req.json()
  const { refreshToken } = refreshSchema.parse(body)

  // Extract user ID from request (should be set in middleware during token validation)
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    throw ApiError.unauthorized('User context missing')
  }

  // Rotate the refresh token (validates old token and creates new one)
  const rotationResult = await rotateRefreshToken(userId, refreshToken)

  if (!rotationResult.success) {
    logger.warn('Token rotation failed', {
      userId,
      error: rotationResult.error,
    })

    throw ApiError.unauthorized(rotationResult.error || 'Token rotation failed')
  }

  // Generate new JWT access token
  const accessToken = await signJWT(
    { userId, role: 'user' },
    { expiresIn: '1h' }
  )

  logger.auth('token_refresh', userId, {
    rotated: true,
  })

  const response = createSuccessResponse({
    accessToken,
    refreshToken: rotationResult.newToken,
    tokenType: 'Bearer',
    expiresIn: 3600, // 1 hour in seconds
  })

  // Secure HTTP-only cookie for refresh token
  response.headers.set(
    'Set-Cookie',
    `refreshToken=${rotationResult.newToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
  )

  return response
});
