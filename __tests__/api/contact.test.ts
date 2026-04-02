/**
 * API Route Tests: POST /api/contact
 *
 * Tests for contact form submission endpoint:
 * - Validation (required fields, email format)
 * - Rate limiting (max 3 per 5 minutes)
 * - Database persistence (contactMessage stored)
 * - Error handling (400, 429, 500 responses)
 * - Email notification (mock send)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '@/app/api/contact/route'
import { prisma } from '@/lib/db'
import { checkRateLimit } from '@/lib/security/rateLimiter'

// Mock dependencies
vi.mock('@/lib/db')
vi.mock('@/lib/security/rateLimiter')
vi.mock('@/lib/mocks')

describe('POST /api/contact', () => {
  const mockRequest = (body: unknown) => ({
    json: async () => body,
  }) as any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Validation', () => {
    it('should reject missing required fields', async () => {
      const req = mockRequest({ name: 'John' }) // missing email, subject, message
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error?.code).toBe('VALIDATION_ERROR')
    })

    it('should reject invalid email format', async () => {
      const req = mockRequest({
        name: 'John Doe',
        email: 'not-an-email',
        subject: 'Hello',
        message: 'Test message',
      })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(400)
      expect(data.error?.code).toBe('VALIDATION_ERROR')
    })

    it('should reject name shorter than 2 chars', async () => {
      const req = mockRequest({
        name: 'A',
        email: 'test@example.com',
        subject: 'Hello',
        message: 'Test message',
      })
      const res = await POST(req)

      expect(res.status).toBe(400)
    })

    it('should reject message shorter than 10 chars', async () => {
      const req = mockRequest({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Hello',
        message: 'Short',
      })
      const res = await POST(req)

      expect(res.status).toBe(400)
    })
  })

  describe('Rate Limiting', () => {
    it('should return 429 when rate limit exceeded', async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce(false)

      const req = mockRequest({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Hello',
        message: 'Test message',
      })
      const res = await POST(req)

      expect(res.status).toBe(429)
      expect(await res.json()).toEqual(
        expect.objectContaining({ error: { code: 'RATE_LIMIT' } })
      )
    })

    it('should allow request when rate limit not exceeded', async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce(true)
      vi.mocked(prisma.contactMessage.create).mockResolvedValueOnce({
        id: '123',
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Hello',
        message: 'Test message',
        createdAt: new Date(),
      } as any)

      const req = mockRequest({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Hello',
        message: 'Test message',
      })
      const res = await POST(req)

      expect(res.status).toBe(201)
    })
  })

  describe('Database Operations', () => {
    it('should save contact message to database', async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce(true)

      const messageData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content here',
      }

      vi.mocked(prisma.contactMessage.create).mockResolvedValueOnce({
        id: '123',
        ...messageData,
        createdAt: new Date(),
      } as any)

      const req = mockRequest(messageData)
      const res = await POST(req)

      expect(vi.mocked(prisma.contactMessage.create)).toHaveBeenCalledWith({
        data: messageData,
      })
    })

    it('should handle database constraint errors', async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce(true)
      vi.mocked(prisma.contactMessage.create).mockRejectedValueOnce({
        code: 'P2002',
        meta: { target: ['email'] },
      })

      const req = mockRequest({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Hello',
        message: 'Test message',
      })
      const res = await POST(req)

      expect(res.status).toBe(409)
      expect(await res.json()).toEqual(
        expect.objectContaining({ error: { code: 'DUPLICATE_ENTRY' } })
      )
    })
  })

  describe('Success Response', () => {
    it('should return 201 with message ID on success', async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce(true)
      vi.mocked(prisma.contactMessage.create).mockResolvedValueOnce({
        id: 'msg-123',
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Hello',
        message: 'Test message',
        createdAt: new Date(),
      } as any)

      const req = mockRequest({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Hello',
        message: 'Test message',
      })
      const res = await POST(req)
      const data = await res.json()

      expect(res.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('msg-123')
    })
  })

  describe('Error Handling', () => {
    it('should return 500 on unexpected database error', async () => {
      vi.mocked(checkRateLimit).mockResolvedValueOnce(true)
      vi.mocked(prisma.contactMessage.create).mockRejectedValueOnce(
        new Error('Database connection failed')
      )

      const req = mockRequest({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Hello',
        message: 'Test message',
      })
      const res = await POST(req)

      expect(res.status).toBe(500)
      expect(await res.json()).toEqual(
        expect.objectContaining({ success: false, error: { code: 'INTERNAL_SERVER_ERROR' } })
      )
    })
  })
})
