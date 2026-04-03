/**
 * Integration Tests for Contact API
 * Tests: Validation, Rate Limiting, Database Operations, Email Notification
 */

import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/security/rateLimiter');
jest.mock('@/lib/db');
jest.mock('resend');

describe('Contact API Integration Tests', () => {
  let mockRequest: Partial<NextRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      json: jest.fn(),
      headers: new Map([['x-forwarded-for', '127.0.0.1']]),
    };
  });

  describe('Valid Contact Submission', () => {
    it('should accept valid contact form data', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I have a security project that needs attention.',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(validData);

      const response = await POST(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('message', 'Message sent successfully');
    });

    it('should save contact message to database', async () => {
      const validData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Consultation Request',
        message: 'We need security consulting for our startup.',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(validData);

      await POST(mockRequest as NextRequest);

      // Verify database was called
      expect(require('@/lib/db').prisma.contactMessage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: validData.name,
          email: validData.email,
          subject: validData.subject,
          message: validData.message,
        }),
      });
    });

    it('should send confirmation email', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I have a security project.',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(validData);

      await POST(mockRequest as NextRequest);

      // Verify email was sent
      expect(require('resend').Resend.prototype.emails.send).toHaveBeenCalled();
    });
  });

  describe('Validation Errors', () => {
    it('should reject missing name', async () => {
      const invalidData = {
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I have a security project.',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(invalidData);

      const response = await POST(mockRequest as NextRequest);
      expect(response.status).toBe(400);
    });

    it('should reject invalid email format', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'not-an-email',
        subject: 'Project Inquiry',
        message: 'I have a security project.',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(invalidData);

      const response = await POST(mockRequest as NextRequest);
      expect(response.status).toBe(400);
    });

    it('should reject short message', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'Hi',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(invalidData);

      const response = await POST(mockRequest as NextRequest);
      expect(response.status).toBe(400);
    });

    it('should return detailed error messages', async () => {
      const invalidData = {
        name: '',
        email: 'invalid',
        subject: 'Hi',
        message: 'Short',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(invalidData);

      const response = await POST(mockRequest as NextRequest);
      const data = await response.json();

      expect(data).toHaveProperty('errors');
      expect(data.errors).toHaveProperty('name');
      expect(data.errors).toHaveProperty('email');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limit for contact endpoint', async () => {
      const mockRateLimiter = require('@/lib/security/rateLimiter');
      mockRateLimiter.checkRateLimit.mockResolvedValue(false);

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I have a security project.',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(validData);

      const response = await POST(mockRequest as NextRequest);
      expect(response.status).toBe(429);
    });

    it('should include retry-after header in rate limit response', async () => {
      const mockRateLimiter = require('@/lib/security/rateLimiter');
      mockRateLimiter.checkRateLimit.mockResolvedValue(false);

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I have a security project.',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(validData);

      const response = await POST(mockRequest as NextRequest);
      expect(response.headers.get('Retry-After')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const mockDb = require('@/lib/db');
      mockDb.prisma.contactMessage.create.mockRejectedValue(
        new Error('Database connection failed')
      );

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I have a security project.',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(validData);

      const response = await POST(mockRequest as NextRequest);
      expect(response.status).toBe(500);
    });

    it('should handle email sending errors gracefully', async () => {
      const mockResend = require('resend');
      mockResend.Resend.prototype.emails.send.mockRejectedValue(
        new Error('Email service unavailable')
      );

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I have a security project.',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(validData);

      const response = await POST(mockRequest as NextRequest);
      // Should still return success as message was saved
      expect(response.status).toBe(200);
    });

    it('should log errors for debugging', async () => {
      const consoleSpy = jest.spyOn(console, 'error');
      const mockDb = require('@/lib/db');
      mockDb.prisma.contactMessage.create.mockRejectedValue(
        new Error('Unexpected error')
      );

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I have a security project.',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(validData);

      await POST(mockRequest as NextRequest);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Security', () => {
    it('should sanitize HTML in message', async () => {
      const maliciousData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I have a project <script>alert("xss")</script>',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(maliciousData);

      const mockDb = require('@/lib/db');
      
      await POST(mockRequest as NextRequest);

      // Verify message was sanitized
      const callArgs = mockDb.prisma.contactMessage.create.mock.calls[0][0];
      expect(callArgs.data.message).not.toContain('<script>');
    });

    it('should validate email domain legitimacy', async () => {
      const suspiciousData = {
        name: 'John Doe',
        email: 'test@thisdoesntexist.invalid',
        subject: 'Project Inquiry',
        message: 'I have a security project.',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(suspiciousData);

      const response = await POST(mockRequest as NextRequest);
      expect(response.status).toBe(400);
    });
  });
});
