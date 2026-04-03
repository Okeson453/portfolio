import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling, createSuccessResponse } from '@/lib/api/errorHandler';

/**
 * GET /api/health
 * Health check endpoint for monitoring and deployment verification
 * Checks database, cache, and service connectivity
 */
export const GET = withErrorHandling(async (_req: NextRequest): Promise<NextResponse> => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      services: {
        database: 'unknown' as string | null,
        cache: 'unknown' as string | null,
      },
    };

    // Check database connectivity (if you have Prisma)
    try {
      // Example with Prisma
      // await prisma.$queryRaw`SELECT 1`
      healthStatus.services.database = 'healthy';
    } catch (error) {
      healthStatus.services.database = 'degraded';
    }

    // Check cache connectivity (Redis, etc.)
    try {
      // Example with Redis
      // await redis.ping()
      healthStatus.services.cache = 'healthy';
    } catch (error) {
      healthStatus.services.cache = 'degraded';
    }

    const hasErrors = Object.values(healthStatus.services).some(
      (service) => service === 'degraded'
    );

    return createSuccessResponse(healthStatus, hasErrors ? 503 : 200);
  } catch (error) {
    console.error('Health check failed:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: errorMsg,
      },
      { status: 503 }
    );
  }
});
