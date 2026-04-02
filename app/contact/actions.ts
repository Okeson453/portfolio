'use server';

import { z } from 'zod';

// ===== FORM VALIDATION SCHEMA =====
const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject is too long').optional().nullish(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
});

export type ContactFormData = z.infer<typeof ContactSchema>;

export type ContactFormState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  errors?: Partial<Record<keyof ContactFormData, string[]>>;
};

/**
 * Server Action to submit contact form
 * ✅ Built-in CSRF protection via Next.js 15 Server Actions
 * ✅ All validation on server-side (can't be bypassed)
 * ✅ Email sending on secure backend only
 */
export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    subject: formData.get('subject')?.toString() || undefined,
    message: formData.get('message')?.toString() || '',
  };

  // ===== VALIDATE =====
  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please fix the errors below.',
      errors: parsed.error.flatten().fieldErrors as Partial<Record<keyof ContactFormData, string[]>>,
    };
  }

  // ===== SEND EMAIL =====
  try {
    // Replace with your actual email provider:
    // - Resend.com (recommended for Next.js)
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer
    // For now, we'll simulate success
    // In production, implement with your email service:
    // await sendEmailViaResend(parsed.data);
    // OR
    // await sendEmailViaEmailJS(parsed.data);

    // TODO: Implement actual email sending here
    // Example with Resend:
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: process.env.CONTACT_EMAIL!,
    //   replyTo: parsed.data.email,
    //   subject: `New Portfolio Contact: ${parsed.data.subject || parsed.data.name}`,
    //   html: `<h2>${parsed.data.name}</h2><p>${parsed.data.email}</p><p>${parsed.data.message}</p>`,
    // });

    return {
      status: 'success',
      message: 'Message sent successfully! I\'ll reply within 24 hours.',
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Something went wrong. Please try again or email me directly at eolamide453@gmail.com',
    };
  }
}
