import { describe, it, expect } from '@jest/globals';

// Simple utility function for testing
const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one digit');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

describe('Security Utilities', () => {
    describe('Password Validation', () => {
        it('should accept a strong password', () => {
            const result = validatePassword('SecurePass123!');
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject password that is too short', () => {
            const result = validatePassword('Short1!');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Password must be at least 8 characters long');
        });

        it('should reject password without uppercase letter', () => {
            const result = validatePassword('securepass123!');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Password must contain at least one uppercase letter');
        });

        it('should reject password without lowercase letter', () => {
            const result = validatePassword('SECUREPASS123!');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Password must contain at least one lowercase letter');
        });

        it('should reject password without digit', () => {
            const result = validatePassword('SecurePass!');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Password must contain at least one digit');
        });

        it('should reject password without special character', () => {
            const result = validatePassword('SecurePass123');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Password must contain at least one special character');
        });

        it('should return all validation errors for completely invalid password', () => {
            const result = validatePassword('weak');
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(2);
        });
    });
});
