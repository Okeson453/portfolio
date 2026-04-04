import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';

// Contact form schema (same as in API route)
const contactSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    subject: z.string().min(5).max(200),
    message: z.string().min(10).max(5000),
});

describe('Contact Form Validation', () => {
    it('should validate a correct contact submission', () => {
        const validData = {
            name: 'John Okeson',
            email: 'okeson453@gmail.com',
            subject: 'Excellent Portfolio',
            message: 'This is a great portfolio showcasing security expertise.',
        };

        expect(() => contactSchema.parse(validData)).not.toThrow();
    });

    it('should reject name that is too short', () => {
        const invalidData = {
            name: 'J', // Less than 2 characters
            email: 'okeson453@gmail.com',
            subject: 'Test Subject',
            message: 'This is a valid message that meets the minimum length requirement.',
        };

        expect(() => contactSchema.parse(invalidData)).toThrow(z.ZodError);
    });

    it('should reject invalid email address', () => {
        const invalidData = {
            name: 'John Okeson',
            email: 'not-an-email', // Invalid email format
            subject: 'Test Subject',
            message: 'This is a valid message that meets the minimum length requirement.',
        };

        expect(() => contactSchema.parse(invalidData)).toThrow(z.ZodError);
    });

    it('should reject message that is too short', () => {
        const invalidData = {
            name: 'John Okeson',
            email: 'okeson453@gmail.com',
            subject: 'Test Subject',
            message: 'Short', // Less than 10 characters
        };

        expect(() => contactSchema.parse(invalidData)).toThrow(z.ZodError);
    });

    it('should reject name that exceeds maximum length', () => {
        const invalidData = {
            name: 'A'.repeat(101), // More than 100 characters
            email: 'okeson453@gmail.com',
            subject: 'Test Subject',
            message: 'This is a valid message that meets the minimum length requirement.',
        };

        expect(() => contactSchema.parse(invalidData)).toThrow(z.ZodError);
    });
});
