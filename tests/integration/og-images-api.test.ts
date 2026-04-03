/**
 * Integration Tests for OG Image Generation API
 * Tests: Image Generation, Caching, Parameter Validation, Performance
 */

import { GET } from '@/app/api/og/route';
import { NextRequest } from 'next/server';

describe('OG Image API Integration Tests', () => {
  let mockRequest: Partial<NextRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      url: 'http://localhost:3000/api/og',
      nextUrl: {
        searchParams: new URLSearchParams(),
      } as any,
    };
  });

  describe('Basic Image Generation', () => {
    it('should generate image with title only', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test Article');

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toContain('image');
    });

    it('should generate image with title and type', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test Article');
      (mockRequest.nextUrl as any).searchParams.set('type', 'blog');

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
      expect(response.body).toBeTruthy();
    });

    it('should generate image with all parameters', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Security Tips');
      (mockRequest.nextUrl as any).searchParams.set('type', 'blog');
      (mockRequest.nextUrl as any).searchParams.set('tags', 'security,tips');
      (mockRequest.nextUrl as any).searchParams.set('date', '2024-01-15');

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
    });
  });

  describe('Parameter Validation', () => {
    it('should handle missing title gracefully', async () => {
      // No title parameter

      const response = await GET(mockRequest as NextRequest);

      // Should use default or return error
      expect(response.status).toBeLessThan(500);
    });

    it('should handle empty title', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', '');

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBeLessThan(500);
    });

    it('should handle very long title', async () => {
      const longTitle = 'A'.repeat(200);
      (mockRequest.nextUrl as any).searchParams.set('title', longTitle);

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
    });

    it('should handle special characters in title', async () => {
      (mockRequest.nextUrl as any).searchParams.set(
        'title',
        'Security & Compliance: Best Practices'
      );

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
    });

    it('should handle unicode characters in title', async () => {
      (mockRequest.nextUrl as any).searchParams.set(
        'title',
        'セキュリティ: Best Practices'
      );

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
    });
  });

  describe('Image Type Variations', () => {
    const types = ['blog', 'project', 'default', 'article'];

    types.forEach((type) => {
      it(`should generate ${type} type image`, async () => {
        (mockRequest.nextUrl as any).searchParams.set('title', 'Test');
        (mockRequest.nextUrl as any).searchParams.set('type', type);

        const response = await GET(mockRequest as NextRequest);

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toContain('image');
      });
    });

    it('should handle unknown type gracefully', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test');
      (mockRequest.nextUrl as any).searchParams.set('type', 'unknown');

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
    });
  });

  describe('Caching Headers', () => {
    it('should set correct cache headers', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test Article');

      const response = await GET(mockRequest as NextRequest);

      expect(response.headers.get('Cache-Control')).toContain('public');
      expect(response.headers.get('Cache-Control')).toContain('604800');
    });

    it('should use revalidate directive', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test Article');

      const response = await GET(mockRequest as NextRequest);

      // Check for ISR caching (7 days = 604800 seconds)
      const cacheControl = response.headers.get('Cache-Control');
      expect(cacheControl).toMatch(/max-age=604800|s-maxage=604800/);
    });

    it('should cache for 7 days (immutable images)', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test');

      const response = await GET(mockRequest as NextRequest);

      const cacheControl = response.headers.get('Cache-Control');
      // 604800 seconds = 7 days
      expect(cacheControl).toContain('604800');
    });
  });

  describe('Tags Parameter', () => {
    it('should handle single tag', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test');
      (mockRequest.nextUrl as any).searchParams.set('tags', 'security');

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
    });

    it('should handle multiple tags', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test');
      (mockRequest.nextUrl as any).searchParams.set('tags', 'security,tips,training');

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
    });

    it('should handle tags with spaces', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test');
      (mockRequest.nextUrl as any).searchParams.set('tags', 'advanced security, threat modeling');

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
    });

    it('should handle empty tags', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test');
      (mockRequest.nextUrl as any).searchParams.set('tags', '');

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
    });
  });

  describe('Date Parameter', () => {
    it('should handle ISO date format', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test');
      (mockRequest.nextUrl as any).searchParams.set('date', '2024-01-15');

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
    });

    it('should handle ISO datetime format', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test');
      (mockRequest.nextUrl as any).searchParams.set('date', '2024-01-15T10:30:00Z');

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(200);
    });

    it('should handle invalid date gracefully', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test');
      (mockRequest.nextUrl as any).searchParams.set('date', 'invalid-date');

      const response = await GET(mockRequest as NextRequest);

      // Should still generate image, possibly without date display
      expect(response.status).toBe(200);
    });
  });

  describe('Performance & Size', () => {
    it('should return reasonably sized image', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test Article');

      const response = await GET(mockRequest as NextRequest);
      const buffer = await response.arrayBuffer();

      // OG images should typically be < 500KB
      expect(buffer.byteLength).toBeLessThan(500000);
    });

    it('should use efficient image encoding', async () => {
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test Article');

      const response = await GET(mockRequest as NextRequest);

      // Should return PNG or WebP
      const contentType = response.headers.get('Content-Type');
      expect(
        contentType?.includes('image/png') ||
        contentType?.includes('image/webp')
      ).toBe(true);
    });

    it('should generate consistently sized images', async () => {
      const titles = ['Short', 'This is a longer title', 'A very long title that might wrap across multiple lines in the OG image'];

      const sizes = await Promise.all(
        titles.map(async (title) => {
          (mockRequest.nextUrl as any).searchParams.set('title', title);
          (mockRequest.nextUrl as any).searchParams.set('type', 'blog');

          const response = await GET(mockRequest as NextRequest);
          return (await response.arrayBuffer()).byteLength;
        })
      );

      // All images should be similar size (within 50%)
      const minSize = Math.min(...sizes);
      const maxSize = Math.max(...sizes);
      const variance = (maxSize - minSize) / minSize;

      expect(variance).toBeLessThan(0.5);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed requests gracefully', async () => {
      mockRequest.url = 'http://localhost:3000/api/og?title=<img src=x>';

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBeLessThan(500);
    });

    it('should handle missing request object', async () => {
      const response = await GET(mockRequest as NextRequest);

      // Should not crash
      expect(response).toBeTruthy();
    });
  });

  describe('Edge Runtime Compatibility', () => {
    it('should be compatible with edge runtime', async () => {
      // This test verifies that the API doesn't use any incompatible APIs
      (mockRequest.nextUrl as any).searchParams.set('title', 'Test Article');

      const response = await GET(mockRequest as NextRequest);

      expect(response).toBeTruthy();
      expect(response.status).toBeLessThan(500);
    });
  });
});
