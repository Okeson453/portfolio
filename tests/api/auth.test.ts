/**
 * API Route Tests: POST /api/auth/login
 *
 * Tests for login endpoint:
 * - Validation (email, password required)
 * - Rate limiting (max 5 attempts per 10 minutes)
 * - Incorrect credentials (401)
 * - Successful login (200 with token)
 * - Database errors (500)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '@/app/api/auth/login/route'
import { prisma } from '@/lib/db'
import { checkRateLimit } from '@/lib/security/rateLimiter'

vi.mock('@/lib/db')
vi.mock('@/lib/security/rateLimiter')
vi.mock('bcryptjs')

describe('POST /api/auth/login', () => {
  const mockRequest = (body: unknown) => ({
    json: async () => body,
    ip: '127.0.0.1',
    headers: new Map(),
  }) as any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Validation', () => {
    it('should reject missing email', async () => {
      const req = mockRequest({ password: 'password123' })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(400)
      expect(data.error?.code).toContain('VALIDATION')
    })

    it('should reject missing password', async () => {
      const req = mockRequest({ email: 'test@example.com' })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(400)
    })

    it('should reject invalid email format', async () => {
      const req = mockRequest({
        email: 'not-an-email',
        password: 'password123',
      })
      const res = await POST(req)

      expect(res.status).toBe(400)
    })
  })

  describe('Rate Limiting', () => {
    it('should return 429 when rate limit exceeded', async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce(false)

      const req = mockRequest({
        email: 'test@example.com',
        password: 'password123',
      })
      const res = await POST(req)

      expect(res.status).toBe(429)
    })
  })

  describe('Authentication', () => {
    it('should return 401 for non-existent user', async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce(true)
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)

      const req = mockRequest({
        email: 'notfound@example.com',
        password: 'password123',
      })
      const res = await POST(req)

      expect(res.status).toBe(401)
      expect(await res.json()).toEqual(
        expect.objectContaining({ error: { code: 'UNAUTHORIZED' } })
      )
    })

    it('should return 401 for incorrect password', async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce(true)
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
      } as any)

      // Mock bcrypt compare to return false
      const bcrypt = await import('bcryptjs')
      vi.mocked(bcrypt.compare).mockResolvedValueOnce(false)

      const req = mockRequest({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
      const res = await POST(req)

      expect(res.status).toBe(401)
    })
  })

  describe('Success Response', () => {
    it('should return 200 with auth token on successful login', async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce(true)
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
      } as any)

      const req = mockRequest({
        email: 'test@example.com',
        password: 'password123',
      })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('token')
    })
  })

  describe('Error Handling', () => {
    it('should return 500 on database error', async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce(true)
      vi.mocked(prisma.user.findUnique).mockRejectedValueOnce(
        new Error('Database connection failed')
      )

      const req = mockRequest({
        email: 'test@example.com',
        password: 'password123',
      })
      const res = await POST(req)

      expect(res.status).toBe(500)
    })
  })
})
