import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { z } from 'zod';

export const runtime = 'edge';

const commentSchema = z.object({
    content: z.string().min(1).max(1000),
    postId: z.string(),
});

export async function GET(req: NextRequest) {
    try {
        const postId = req.nextUrl.searchParams.get('postId');
        const page = parseInt(req.nextUrl.searchParams.get('page') || '1');

        if (!postId) {
            return NextResponse.json(
                { error: 'Missing postId' },
                { status: 400 }
            );
        }

        const comments = await prisma.comment.findMany({
            where: { postId },
            include: { author: { select: { id: true, name: true, avatar: true } } },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * 10,
            take: 10,
        });

        const total = await prisma.comment.count({ where: { postId } });

        return NextResponse.json({ comments, total, page });
    } catch (err) {
        console.error('[/api/comments GET]', err);
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const rateLimited = await checkRateLimit(req, 'comment');
        if (!rateLimited) {
            return NextResponse.json(
                { error: 'Too many comments. Try again later.' },
                { status: 429 }
            );
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

        return NextResponse.json(comment, { status: 201 });
    } catch (err) {
        console.error('[/api/comments POST]', err);
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }
}
