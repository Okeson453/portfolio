'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    Calendar,
    Send,
    Loader,
    AlertCircle,
    CheckCircle,
    Clock,
    Share2,
} from 'lucide-react';

interface BlogSchedule {
    id: string;
    postId: string;
    scheduledFor: string;
    frequency: string;
    enabled: boolean;
    publishedAt?: string;
}

export function BlogScheduleManager() {
    const [schedules, setSchedules] = useState<BlogSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isScheduling, setIsScheduling] = useState(false);
    const [postId, setPostId] = useState('');
    const [scheduledFor, setScheduledFor] = useState('');
    const [frequency, setFrequency] = useState<'once' | 'weekly' | 'biweekly' | 'monthly'>(
        'once'
    );
    const [platforms, setPlatforms] = useState<string[]>([]);

    // Fetch upcoming schedules
    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/blog/schedule?days=30');
            if (!response.ok) throw new Error('Failed to fetch schedules');
            const data = await response.json();
            setSchedules(data);
        } catch (error) {
            toast.error('Failed to load schedules');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSchedulePost = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!postId || !scheduledFor) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsScheduling(true);

        try {
            const response = await fetch('/api/blog/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId,
                    scheduledFor,
                    frequency,
                    platforms: platforms.length > 0 ? platforms : undefined,
                }),
            });

            if (!response.ok) throw new Error('Failed to schedule post');

            toast.success('Post scheduled successfully!');
            setPostId('');
            setScheduledFor('');
            setPlatforms([]);
            await fetchSchedules();
        } catch (error) {
            toast.error('Failed to schedule post');
        } finally {
            setIsScheduling(false);
        }
    };

    const handlePublishNow = async (id: string) => {
        try {
            const response = await fetch('/api/blog/schedule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId: id }),
            });

            if (!response.ok) throw new Error('Failed to publish');

            toast.success('Post published successfully!');
            await fetchSchedules();
        } catch (error) {
            toast.error('Failed to publish post');
        }
    };

    return (
        <div className="space-y-8">
            {/* Schedule New Post Section */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                    Schedule Blog Post
                </h2>

                <form onSubmit={handleSchedulePost} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Post ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Post ID
                            </label>
                            <input
                                type="text"
                                value={postId}
                                onChange={(e) => setPostId(e.target.value)}
                                placeholder="Enter post ID"
                                required
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                            />
                        </div>

                        {/* Scheduled Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Publish Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                value={scheduledFor}
                                onChange={(e) => setScheduledFor(e.target.value)}
                                required
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Frequency */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Frequency
                            </label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value as typeof frequency)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                            >
                                <option value="once">Once</option>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>

                        {/* Social Media Platforms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Share to Social Media
                            </label>
                            <div className="mt-2 space-y-2">
                                {['twitter', 'linkedin', 'facebook', 'threads'].map((platform) => (
                                    <label key={platform} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={platforms.includes(platform)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setPlatforms([...platforms, platform]);
                                                } else {
                                                    setPlatforms(platforms.filter((p) => p !== platform));
                                                }
                                            }}
                                            className="rounded"
                                        />
                                        <span className="capitalize text-gray-700 dark:text-gray-300">{platform}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isScheduling}
                        className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 md:w-auto"
                    >
                        {isScheduling ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader className="h-4 w-4 animate-spin" />
                                Scheduling...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Schedule Post
                            </span>
                        )}
                    </button>
                </form>
            </div>

            {/* Upcoming Schedules */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                    Upcoming Schedules
                </h2>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader className="h-6 w-6 animate-spin" />
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 py-8 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        <AlertCircle className="h-5 w-5" />
                        No scheduled posts
                    </div>
                ) : (
                    <div className="space-y-3">
                        {schedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        {schedule.publishedAt ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <Clock className="h-5 w-5 text-blue-500" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                Post {schedule.postId}
                                            </p>
                                            <p className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(schedule.scheduledFor).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {schedule.frequency !== 'once' && (
                                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                            {schedule.frequency}
                                        </span>
                                    )}
                                    {!schedule.publishedAt && (
                                        <button
                                            onClick={() => handlePublishNow(schedule.postId)}
                                            className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                                        >
                                            Publish Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Email Campaign Statistics Component
 */
export function EmailCampaignStats() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/blog/email-history');
            if (response.ok) {
                const data = await response.json();
                // Calculate stats from data
                const totalSent = data.length;
                const opened = data.filter((e: any) => e.status === 'opened').length;
                const clicked = data.filter((e: any) => e.status === 'clicked').length;

                setStats({
                    totalSent,
                    opened,
                    clicked,
                    openRate: totalSent > 0 ? ((opened / totalSent) * 100).toFixed(1) : '0',
                    clickRate: totalSent > 0 ? ((clicked / totalSent) * 100).toFixed(1) : '0',
                });
            }
        } catch (error) {
            console.error('Failed to fetch stats');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (!stats) {
        return <div className="text-center text-gray-500">No email campaign data</div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-5">
            <StatCard
                label="Total Sent"
                value={stats.totalSent.toLocaleString()}
                icon="📧"
            />
            <StatCard label="Opened" value={stats.opened.toLocaleString()} icon="👁️" />
            <StatCard label="Clicked" value={stats.clicked.toLocaleString()} icon="🖱️" />
            <StatCard label="Open Rate" value={`${stats.openRate}%`} icon="📊" />
            <StatCard label="Click Rate" value={`${stats.clickRate}%`} icon="🔗" />
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: string;
}) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 text-2xl">{icon}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    );
}
