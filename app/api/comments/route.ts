import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { checkRateLimit, applyRateLimitHeaders } from '@/lib/security/rateLimiter';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';
import { z } from 'zod';

export const runtime = 'edge';

const commentSchema = z.object({
    content: z.string().min(1).max(1000),
    postId: z.string(),
});

export const GET = withErrorHandling(async (req: NextRequest): Promise<NextResponse> => {
    const postId = req.nextUrl.searchParams.get('postId');
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');

    if (!postId) {
        throw ApiError.badRequest('Missing postId parameter');
    }

    const comments = await prisma.comment.findMany({
        where: { postId },
        include: { author: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * 10,
        take: 10,
    });

    const total = await prisma.comment.count({ where: { postId } });

    return createSuccessResponse({ comments, total, page });
});

export const POST = withErrorHandling(async (req: NextRequest): Promise<NextResponse> => {
    const session = await getSession();

    if (!session) {
        throw ApiError.unauthorized('Authentication required');
    }

    const rateLimit = await checkRateLimit(req, 'comments:create');
    if (!rateLimit.allowed) {
        throw ApiError.tooManyRequests();
    }

    const body = await req.json();
    const validated = commentSchema.parse(body);

    const comment = await prisma.comment.create({
        data: {
            content: validated.content,
            postId: validated.postId,
            authorId: session.userId,
        },
        include: { author: { select: { id: true, name: true, avatar: true } } },
    });

    const response = createSuccessResponse(comment, 201);
    return applyRateLimitHeaders(response, rateLimit);
});
