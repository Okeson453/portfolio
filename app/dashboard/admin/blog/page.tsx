import { Metadata } from 'next';
import { BlogScheduleManager, EmailCampaignStats } from '@/components/BlogScheduleManager';


export const metadata: Metadata = {
    title: 'Blog Management - Admin Dashboard',
    description: 'Manage blog automation, subscriptions, and social media sharing',
};

export default function BlogManagementPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Blog Automation Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Manage blog publishing schedules, email subscriptions, and social media sharing
                    </p>
                </div>

                {/* Email Campaign Stats */}
                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Email Campaign Performance
                    </h2>
                    <EmailCampaignStats />
                </div>

                {/* Blog Schedule Manager */}
                <BlogScheduleManager />

                {/* Features Overview */}
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    <FeatureCard
                        title="Scheduled Publishing"
                        description="Schedule blog posts to publish automatically at specific times with recurring options"
                        icon="📅"
                    />
                    <FeatureCard
                        title="Email Subscriptions"
                        description="Collect and manage email subscribers with verification and preference management"
                        icon="📧"
                    />
                    <FeatureCard
                        title="Social Media Sharing"
                        description="Auto-share published posts to Twitter, LinkedIn, Facebook, and Threads"
                        icon="📱"
                    />
                </div>

                {/* Environment Variables Setup Guide */}
                <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-900/20">
                    <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-200">
                        Environment Variables Required
                    </h3>
                    <div className="space-y-3 text-sm text-blue-800 dark:text-blue-300">
                        <p>
                            <code className="rounded bg-blue-900 px-2 py-1 text-blue-100">
                                RESEND_API_KEY
                            </code>
                            - Your Resend API key for sending emails
                        </p>
                        <p>
                            <code className="rounded bg-blue-900 px-2 py-1 text-blue-100">
                                RESEND_FROM_EMAIL
                            </code>
                            - Email address to send from (e.g., noreply@yourdomain.com)
                        </p>
                        <p>
                            <code className="rounded bg-blue-900 px-2 py-1 text-blue-100">
                                NEXT_PUBLIC_SITE_URL
                            </code>
                            - Your site URL (e.g., https://yourdomain.com)
                        </p>
                        <p>
                            <code className="rounded bg-blue-900 px-2 py-1 text-blue-100">CRON_SECRET</code>
                            - Secret token for cron job authentication
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({
    title,
    description,
    icon,
}: {
    title: string;
    description: string;
    icon: string;
}) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 text-3xl">{icon}</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    );
}
