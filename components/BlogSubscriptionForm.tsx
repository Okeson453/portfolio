'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface SubscriptionFormProps {
    onSuccess?: () => void;
    title?: string;
    subtitle?: string;
    buttonText?: string;
}

export function BlogSubscriptionForm({
    onSuccess,
    title = 'Subscribe to Our Blog',
    subtitle = 'Get the latest articles delivered to your inbox',
    buttonText = 'Subscribe',
}: SubscriptionFormProps) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter an email address');
            return;
        }

        setIsLoading(true);
        setStatus('idle');

        try {
            const response = await fetch('/api/blog/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    name: name || undefined,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to subscribe');
            }

            setStatus('success');
            setEmail('');
            setName('');
            toast.success('Check your email to verify your subscription!');

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            setStatus('error');
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to subscribe. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-lg dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="mb-6 text-center">
                <div className="mb-3 flex justify-center">
                    <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                        <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>

            {/* Form */}
            {status !== 'success' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name (Optional)
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {/* Subscribe Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-2 font-semibold text-white transition-all hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 dark:from-blue-500 dark:to-blue-600"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader className="h-4 w-4 animate-spin" />
                                Subscribing...
                            </span>
                        ) : (
                            buttonText
                        )}
                    </button>
                </form>
            ) : (
                /* Success Message */
                <div className="space-y-4 text-center">
                    <div className="flex justify-center">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Subscription Confirmed!
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Check your email to verify your subscription and start receiving updates.
                        </p>
                    </div>
                    <button
                        onClick={() => setStatus('idle')}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Subscribe another email →
                    </button>
                </div>
            )}

            {/* Error Alert */}
            {status === 'error' && (
                <div className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p>Something went wrong. Please try again.</p>
                </div>
            )}

            {/* Privacy Notice */}
            <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                We respect your privacy. Unsubscribe anytime.
            </p>
        </div>
    );
}

/**
 * Minimal subscription form optimized for inline placement
 */
export function BlogSubscriptionMinimal({ onSuccess }: { onSuccess?: () => void }) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            const response = await fetch('/api/blog/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setEmail('');
                toast.success('Subscription confirmed! Check your email.');
                onSuccess?.();
            }
        } catch (error) {
            toast.error('Failed to subscribe');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
                {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Subscribe'}
            </button>
        </form>
    );
}
