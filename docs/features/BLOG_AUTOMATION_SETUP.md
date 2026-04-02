# Blog Automation Setup Guide

This guide shows how to set up and use the blog automation features including scheduled publishing, email subscriptions, and social media sharing.

## Features

### 📅 Scheduled Blog Publishing
- Schedule blog posts to publish at specific times
- Support for recurring schedules (weekly, bi-weekly, monthly)
- Automatic email notifications to subscribers
- Automatic social media sharing

### 📧 Email Subscriptions
- Collect email subscriptions from users
- Email verification for new subscribers
- Unsubscribe functionality
- Category/topic preferences
- Email engagement tracking (opens, clicks)

### 📱 Social Media Sharing
- Auto-share blog posts to multiple platforms
- Supported platforms: Twitter, LinkedIn, Facebook, Threads
- Platform-specific content formatting
- Scheduled sharing for optimal engagement
- Engagement metrics tracking

## 🚀 Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL database
- Resend account (for email sending)
- Environment variables configured

### 2. Install Dependencies

All required dependencies are already included:
- `resend` - Email sending
- `@prisma/client` - Database ORM
- `date-fns` - Date/time utilities
- `zod` - Data validation

### 3. Environment Variables

Create or update your `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Site Configuration
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Cron Job Security
CRON_SECRET="your-secure-random-token"
```

### 4. Database Migration

The Prisma schema has been extended with new tables:
- `EmailSubscriber` - Manages email subscriptions
- `BlogSchedule` - Stores scheduled publishing
- `SocialMediaShare` - Tracks social media shares
- `EmailHistory` - Tracks email engagement

Run migration:

```bash
npm run db:push
```

Or for development:

```bash
npm run db:migrate
```

### 5. Vercel Deployment

The `vercel.json` has been configured with cron jobs:

```json
"crons": [
    {
        "path": "/api/cron/blog-publish",
        "schedule": "0 */6 * * *"  // Every 6 hours
    },
    {
        "path": "/api/cron/social-media-share",
        "schedule": "0 9,15 * * *"  // 9 AM and 3 PM daily
    }
]
```

## 📖 API Reference

### Email Subscriptions

#### POST /api/blog/subscribe
Subscribe to blog updates

```bash
curl -X POST https://yourdomain.com/api/blog/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "preferences": ["security", "devops"]
  }'
```

#### GET /api/blog/subscribe/[id]/status
Check subscription status

```bash
curl "https://yourdomain.com/api/blog/subscribe/status?email=user@example.com"
```

#### POST /api/blog/subscribe/[id]/unsubscribe
Unsubscribe from emails

```bash
curl -X POST https://yourdomain.com/api/blog/subscribe/123/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "reason": "Too many emails"}'
```

### Blog Scheduling

#### GET /api/blog/schedule
Get upcoming schedules

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://yourdomain.com/api/blog/schedule?days=30"
```

#### POST /api/blog/schedule
Schedule a blog post

```bash
curl -X POST https://yourdomain.com/api/blog/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "post-id-123",
    "scheduledFor": "2024-12-25T10:00:00Z",
    "frequency": "once",
    "platforms": ["twitter", "linkedin", "facebook"]
  }'
```

#### PUT /api/blog/schedule
Publish post immediately

```bash
curl -X PUT https://yourdomain.com/api/blog/schedule \
  -H "Content-Type: application/json" \
  -d '{"postId": "post-id-123"}'
```

### Email History

#### GET /api/blog/email-history
Get email history

```bash
curl "https://yourdomain.com/api/blog/email-history?postId=post-123&limit=50"
```

#### POST /api/blog/email-history/track
Track email events (open/click)

```bash
curl -X POST https://yourdomain.com/api/blog/email-history/track \
  -H "Content-Type: application/json" \
  -d '{
    "emailHistoryId": "email-123",
    "event": "open"
  }'
```

## 🎨 UI Components

### BlogSubscriptionForm
Full subscription form component

```tsx
import { BlogSubscriptionForm } from '@/components/BlogSubscriptionForm';

export default function SubscribePage() {
  return (
    <BlogSubscriptionForm 
      title="Subscribe to Our Newsletter"
      subtitle="Get weekly tech insights"
      onSuccess={() => console.log('Subscribed!')}
    />
  );
}
```

### BlogSubscriptionMinimal
Minimal inline subscription form

```tsx
import { BlogSubscriptionMinimal } from '@/components/BlogSubscriptionForm';

export default function BlogSidebar() {
  return <BlogSubscriptionMinimal onSuccess={() => {}} />;
}
```

### BlogScheduleManager
Admin blog scheduling interface

```tsx
'use client';
import { BlogScheduleManager, EmailCampaignStats } from '@/components/BlogScheduleManager';

export default function BlogAdmin() {
  return (
    <>
      <EmailCampaignStats />
      <BlogScheduleManager />
    </>
  );
}
```

## 🛠️ Service Functions

### Blog Scheduler Service (`lib/blog-scheduler.ts`)

```typescript
// Schedule a blog post
await scheduleBlogPost(
  postId: string,
  scheduledFor: Date,
  frequency?: 'once' | 'weekly' | 'biweekly' | 'monthly'
)

// Publish a post manually
await publishBlogPost(postId: string)

// Process scheduled posts (called by cron)
await processScheduledPosts()

// Get upcoming schedules
const schedules = await getUpcomingSchedules(days: number)
```

### Social Media Service (`lib/social-media.ts`)

```typescript
// Create social media shares
await createSocialMediaShares({
  postId,
  postUrl,
  title,
  excerpt,
  coverImage,
  platforms: ['twitter', 'linkedin']
})

// Schedule shares for specific times
await scheduleSocialMediaShares(
  postId,
  platforms,
  scheduleTimes
)

// Process scheduled shares (called by cron)
await processScheduledShares()

// Get share statistics
const stats = await getShareStats(postId)
```

## 📧 Email Setup with Resend

1. **Create Resend Account**: Visit [resend.com](https://resend.com)
2. **Get API Key**: Copy your API key from the dashboard
3. **Verify Domain**: Add and verify your domain
4. **Set From Email**: Configure sender email (e.g., noreply@yourdomain.com)
5. **Add Environment Variables**: Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`

## 🔐 Social Media Integration

### Twitter/X Setup
To enable automated Twitter sharing:

1. Create Twitter Developer account
2. Get API credentials
3. Update `lib/social-media.ts` with Twitter API integration
4. Add credentials to environment variables

Similar setup needed for:
- **LinkedIn**: LinkedIn API v2
- **Facebook**: Facebook Graph API
- **Threads**: Threads API (when available)

## 📊 Analytics & Monitoring

### Email Metrics
- Total emails sent
- Open rate
- Click rate
- Bounce rate
- Unsubscribe rate

### Social Media Metrics
- Posts shared
- Views per platform
- Clicks per platform
- Shares per platform

Access at `/dashboard/admin/blog`

## 🐛 Troubleshooting

### Emails not sending
- Check `RESEND_API_KEY` is set correctly
- Verify `RESEND_FROM_EMAIL` is verified in Resend
- Check email address format (valid email required)

### Cron jobs not running
- Verify `CRON_SECRET` is set in environment
- Check cron schedule in `vercel.json`
- Ensure deployment to Vercel (crons only work on Vercel)

### Posts not publishing
- Verify post exists in database
- Check scheduled date is in the future
- Review cron job logs in Vercel dashboard

### Subscribers not receiving emails
- Verify email address is confirmed
- Check subscriber status is 'active'
- Ensure post is published

## 📱 Pages

- `/blog/subscribe` - Subscription landing page
- `/dashboard/admin/blog` - Blog management dashboard (requires auth)

## 🔄 Workflow Example

1. **Create Blog Post**
   - Write and save blog post (status: draft)

2. **Schedule Publishing**
   - Set publication date/time
   - Select social media platforms
   - Choose sharing schedule

3. **Automatic Publishing**
   - Cron job checks schedules every 6 hours
   - Published post status updates
   - Emails sent to subscribers
   - Social media content prepared

4. **Social Media Sharing**
   - Posts shared to selected platforms
   - Metrics tracked for engagement
   - Analytics available in dashboard

5. **Track Engagement**
   - Email opens and clicks tracked
   - Social media metrics fetched
   - Performance reports available

## 🚀 Best Practices

1. **Email Frequency**: Don't spam - 1-2 emails per week is optimal
2. **Social Media**: Vary content across platforms (Twitter ≠ LinkedIn)
3. **Timing**: Schedule posts for when your audience is active
4. **Verification**: Always verify emails for list health
5. **Unsubscribe**: Make unsubscribing easy (builds trust)
6. **Analytics**: Monitor metrics to optimize strategy

## 📝 Next Steps

- [ ] Set up Resend account and add API key
- [ ] Configure environment variables
- [ ] Run database migration
- [ ] Deploy to Vercel
- [ ] Add subscription form to blog page
- [ ] Create admin dashboard access
- [ ] Test scheduling with a test post
- [ ] Integrate social media APIs
- [ ] Monitor cron job execution

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Email Best Practices](https://resend.com/docs/best-practices/email-best-practices)
