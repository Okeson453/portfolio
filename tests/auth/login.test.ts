/// <reference types="jest" />
// @ts-nocheck - Test files are excluded from build, these imports work at runtime

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { POST } from '@/api/auth/login/route'
import { prisma } from '@/lib/db/client'
import { hashPassword } from '@/lib/auth/session'

describe('Login API', () => {
  beforeEach(async () => {
    // Clean up database
    await prisma.user.deleteMany()
  })

  afterEach(async () => {
    // Clean up after each test
    await prisma.user.deleteMany()
  })

  it('should login with valid credentials', async () => {
    // Create test user
    const password = await hashPassword('testpassword')
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        password,
        name: 'Test User'
      }
    })

    // Make request
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe('test@example.com')
  })

  it('should reject invalid credentials', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      })
    })

    const response = await POST(request as any)

    expect(response.status).toBe(401)
  })

  it('should validate email format', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'testpassword'
      })
    })

    const response = await POST(request as any)

    expect(response.status).toBe(400)
  })

  it('should validate password length', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'short'
      })
    })

    const response = await POST(request as any)

    expect(response.status).toBe(400)
  })
})
