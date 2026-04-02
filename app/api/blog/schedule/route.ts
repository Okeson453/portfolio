import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  publishBlogPost,
  scheduleBlogPost,
  getUpcomingSchedules,
} from '@/lib/blog-scheduler';
import { createSocialMediaShares, scheduleSocialMediaShares } from '@/lib/social-media';
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
export async function GET(request: NextRequest) {
  try {
    const days = request.nextUrl.searchParams.get('days');
    const daysNum = days ? parseInt(days) : 7;

    const schedules = await getUpcomingSchedules(daysNum);

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Schedule fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

/**
 * POST /api/blog/schedule
 * Schedule a blog post for publishing
 */
export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const { postId, scheduledFor, frequency, platforms, socialMediaSchedules } =
      scheduleSchema.parse(json);

    // Verify the blog post exists
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
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

    return NextResponse.json(
      { message: 'Post scheduled successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error('Schedule creation error:', error);
    return NextResponse.json({ error: 'Failed to schedule post' }, { status: 500 });
  }
}

/**
 * POST /api/blog/schedule/publish
 * Immediately publish a scheduled post
 */
export async function PUT(request: NextRequest) {
  try {
    const { postId } = z.object({ postId: z.string() }).parse(await request.json());

    await publishBlogPost(postId);

    return NextResponse.json(
      { message: 'Post published successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Failed to publish post' }, { status: 500 });
  }
}
