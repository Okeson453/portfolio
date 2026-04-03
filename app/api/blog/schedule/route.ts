import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server';
import { prisma } from '@/lib/db';
import {
  publishBlogPost,
  scheduleBlogPost,
  getUpcomingSchedules,
} from '@/lib/blog-scheduler';
import { createSocialMediaShares, scheduleSocialMediaShares } from '@/lib/social-media';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';
import { z } from 'zod';

const scheduleSchema = z.object({
  postId: z.string(),
  scheduledFor: z.string().datetime(),
  frequency: z.enum(['once', 'weekly', 'biweekly', 'monthly']).optional(),
  platforms: z.array(z.enum(['twitter', 'facebook', 'linkedin', 'threads'])).optional(),
  socialMediaSchedules: z
    .array(z.string().datetime())
    .optional(),
});

/**
 * GET /api/blog/schedule
 * Get scheduled blog posts
 */
export const GET = withErrorHandling(async (request: NextRequest): Promise<NextResponseType> => {
  const days = request.nextUrl.searchParams.get('days');
  const daysNum = days ? parseInt(days) : 7;

  const schedules = await getUpcomingSchedules(daysNum);

  return createSuccessResponse(schedules);
});

/**
 * POST /api/blog/schedule
 * Schedule a blog post for publishing
 */
export const POST = withErrorHandling(async (request: NextRequest): Promise<NextResponseType> => {
  const json = await request.json();
  const { postId, scheduledFor, frequency, platforms, socialMediaSchedules } =
    scheduleSchema.parse(json);

  // Verify the blog post exists
  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw ApiError.notFound('Blog post');
  }

  // Schedule the blog post
  await scheduleBlogPost(postId, new Date(scheduledFor), frequency);

  // Create social media shares if platforms specified
  if (platforms && platforms.length > 0) {
    const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`;

    await createSocialMediaShares({
      postId,
      postUrl,
      title: post.title,
      excerpt: post.excerpt || undefined,
      coverImage: post.coverImage || undefined,
      platforms,
    });

    // Schedule social media shares if times provided
    if (socialMediaSchedules && socialMediaSchedules.length > 0) {
      await scheduleSocialMediaShares(
        postId,
        platforms,
        socialMediaSchedules.map((time) => new Date(time))
      );
    }
  }

  return createSuccessResponse({ message: 'Post scheduled successfully' });
});

/**
 * PUT /api/blog/schedule/:postId
 * Immediately publish a scheduled post
 */
export const PUT = withErrorHandling(async (request: NextRequest): Promise<NextResponseType> => {
  const { postId } = z.object({ postId: z.string() }).parse(await request.json());

  await publishBlogPost(postId);

  return createSuccessResponse({ message: 'Post published successfully' });
});
