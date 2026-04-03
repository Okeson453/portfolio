import { NextRequest, NextResponse, type NextResponse as NextResponseType } from 'next/server';
import { prisma } from '@/lib/db';
import { Resend } from 'resend';
import { withErrorHandling, createSuccessResponse, ApiError } from '@/lib/api/errorHandler';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeSchema = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().optional(),
    preferences: z.array(z.string()).optional(),
});

/**
 * POST /api/blog/subscribe
 * Subscribe to blog updates
 */
export const POST = withErrorHandling(async (request: NextRequest): Promise<NextResponseType> => {
    const json = await request.json();
    const { email, name, preferences } = subscribeSchema.parse(json);

    // Check if already subscribed
    const existingSubscriber = await prisma.emailSubscriber.findUnique({
        where: { email },
    });

    if (existingSubscriber) {
        if (existingSubscriber.status === 'active' && existingSubscriber.verifiedAt) {
            return createSuccessResponse({ message: 'Already subscribed', subscriber: existingSubscriber });
        } else if (existingSubscriber.status === 'unsubscribed') {
            // Reactivate subscription
            await prisma.emailSubscriber.update({
                where: { email },
                data: {
                    status: 'active',
                    name,
                    preferences: preferences || [],
                },
            });

            return createSuccessResponse({ message: 'Resubscribed successfully' });
        }
    }

    // Generate verification token
    const verificationToken = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new subscriber
    const subscriber = await prisma.emailSubscriber.create({
        data: {
            email,
            name: name || undefined,
            preferences: preferences || [],
            status: 'active',
            verificationToken,
            verificationTokenExpiresAt,
        },
    });

    // Send verification email
    await sendVerificationEmail(email, name, verificationToken);

    return createSuccessResponse(
        { message: 'Subscribed successfully. Check your email for verification.', subscriber },
        201
    );
});

/**
 * POST /api/blog/subscribe/verify
 * Verify email subscription
 */
export async function PUT(request: NextRequest) {
    try {
        const json = await request.json();
        const { email, token } = z
            .object({
                email: z.string().email(),
                token: z.string(),
            })
            .parse(json);

        const subscriber = await prisma.emailSubscriber.findUnique({
            where: { email },
        });

        if (!subscriber || subscriber.verificationToken !== token) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
        }

        if (subscriber.verificationTokenExpiresAt && subscriber.verificationTokenExpiresAt < new Date()) {
            return NextResponse.json({ error: 'Token expired' }, { status: 400 });
        }

        await prisma.emailSubscriber.update({
            where: { email },
            data: {
                verifiedAt: new Date(),
                verificationToken: null,
                verificationTokenExpiresAt: null,
            },
        });

        return NextResponse.json({ message: 'Email verified successfully' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }

        console.error('Verification error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}

/**
 * Send verification email
 */
async function sendVerificationEmail(
    email: string,
    name: string | undefined,
    token: string
): Promise<void> {
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/subscribe/verify?email=${encodeURIComponent(
        email
    )}&token=${token}`;

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Our Blog Newsletter</h1>
          <p>Hi ${name || 'there'},</p>
          <p>Thank you for subscribing to our blog! Click the button below to confirm your email address.</p>
          <a href="${verifyUrl}" class="button">Verify Email</a>
          <p>Or copy this link: <a href="${verifyUrl}">${verifyUrl}</a></p>
          <p>This link expires in 24 hours.</p>
        </div>
      </body>
    </html>
  `;

    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
            to: email,
            subject: 'Verify your email subscription',
            html,
        });
    } catch (error) {
        console.error('Failed to send verification email:', error);
        throw error;
    }
}
