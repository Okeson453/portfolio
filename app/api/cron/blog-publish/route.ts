import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server';
import { processScheduledPosts } from '@/lib/blog-scheduler';
import { processScheduledShares } from '@/lib/social-media';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';

/**
 * GET /api/cron/blog-publish
 * Cron job to process scheduled blog posts
 * 
 * Setup in vercel.json or call with: curl -H "Authorization: Bearer {CRON_SECRET}" https://yourdomain.com/api/cron/blog-publish
 */
export const GET = withErrorHandling(async (request: NextRequest): Promise<NextResponseType> => {
    // Verify the request is coming from a trusted source
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || process.env.VERCEL_AUTOMATION_BEARER_TOKEN;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        throw ApiError.unauthorized('Invalid cron secret');
    }

    console.log('Starting scheduled blog post processing...');
    await processScheduledPosts();
    console.log('Completed scheduled blog post processing');

    return createSuccessResponse({
        message: 'Blog posts processed successfully',
        timestamp: new Date().toISOString(),
    });
});

/**
 * POST /api/cron/social-media-share
 * Cron job to process scheduled social media shares
 */
export const POST = withErrorHandling(async (request: NextRequest): Promise<NextResponseType> => {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || process.env.VERCEL_AUTOMATION_BEARER_TOKEN;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        throw ApiError.unauthorized('Invalid cron secret');
    }
    }

    try {
        console.log('Starting scheduled social media share processing...');
        await processScheduledShares();
        console.log('Completed scheduled social media share processing');

        return NextResponse.json(
            {
                message: 'Social media shares processed successfully',
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Social media cron job error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process social media shares',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
