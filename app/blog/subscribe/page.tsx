import { Metadata } from 'next';
import { BlogSubscriptionForm, BlogSubscriptionMinimal } from '@/components/BlogSubscriptionForm';

export const metadata: Metadata = {
    title: 'Subscribe to Our Blog',
    description: 'Get the latest articles and insights delivered to your inbox',
};

export default function BlogSubscribePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            <div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
                        Stay Updated
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Subscribe to our newsletter and never miss the latest cybersecurity insights,
                        development tips, and security best practices.
                    </p>
                </div>

                {/* Subscription Form */}
                <div className="mb-16 flex justify-center">
                    <BlogSubscriptionForm />
                </div>

                {/* Features */}
                <div className="grid gap-8 md:grid-cols-3">
                    <FeatureCard
                        icon="📧"
                        title="Weekly Digest"
                        description="Curated articles delivered every week directly to your inbox"
                    />
                    <FeatureCard
                        icon="🔔"
                        title="Instant Notifications"
                        description="Get notified immediately when we publish new content"
                    />
                    <FeatureCard
                        icon="🎯"
                        title="Unsubscribe Anytime"
                        description="You're in control - manage your preferences or unsubscribe instantly"
                    />
                </div>

                {/* FAQ Section */}
                <div className="mt-16 grid gap-8 md:grid-cols-2">
                    <FAQItem
                        question="How often do you send emails?"
                        answer="We typically publish 1-2 articles per week. You'll receive an email notification for each new article, and can choose to digest emails weekly."
                    />
                    <FAQItem
                        question="Can I customize what I receive?"
                        answer="Yes! You can manage your preferences in the subscription settings to choose specific topics or categories you're interested in."
                    />
                    <FAQItem
                        question="Will you share my email?"
                        answer="Never. We never share or sell your email address. It's used solely for sending you blog updates."
                    />
                    <FAQItem
                        question="How do I unsubscribe?"
                        answer="Every email includes an unsubscribe link at the bottom. You can also manage your subscription in your account settings."
                    />
                </div>
            </div>
        </main>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 text-3xl">{icon}</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <details className="group">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h4 className="font-semibold text-gray-900 dark:text-white">{question}</h4>
                <span className="text-gray-600 group-open:rotate-180">▼</span>
            </summary>
            <p className="border-t border-gray-200 bg-gray-50 p-4 text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
                {answer}
            </p>
        </details>
    );
}
