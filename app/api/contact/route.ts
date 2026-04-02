import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mockSendEmail } from '@/lib/mocks';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { z } from 'zod';
import { withErrorHandling, successResponse } from '@/lib/api/errors';

export const runtime = 'edge';

const contactSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    subject: z.string().min(5).max(200),
    message: z.string().min(10).max(5000),
});

export async function POST(req: NextRequest) {
    return withErrorHandling('/api/contact', async () => {
        // Check rate limit
        const rateLimited = await checkRateLimit(req, 'contact');
        if (!rateLimited) {
            return NextResponse.json(
                { success: false, error: { code: 'RATE_LIMIT', message: 'Too many contact requests. Please try again later.' } },
                { status: 429 }
            );
        }

        const body = await req.json();
        const validated = contactSchema.parse(body);

        // Save to database
        const message = await prisma.contactMessage.create({
            data: {
                name: validated.name,
                email: validated.email,
                subject: validated.subject,
                message: validated.message,
            },
        });

        // Send email notification
        await mockSendEmail(
            'contact@securestack.local',
            `New Contact Form Submission: ${validated.subject}`,
            `
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${validated.name} (${validated.email})</p>
        <p><strong>Subject:</strong> ${validated.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validated.message}</p>
      `
        );

        return NextResponse.json(successResponse({ id: message.id }), { status: 201 });
    });
}
