import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
    title: 'Page Not Found - 404',
    description: 'The page you are looking for does not exist or has been moved.',
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
            <div className="max-w-md w-full space-y-8 text-center">
                {/* 404 Number */}
                <div className="space-y-2">
                    <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                        404
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Page Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
                    </p>
                </div>

                {/* Suggestions */}
                <div className="space-y-3 pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-500 font-semibold uppercase tracking-wide">
                        Quick Navigation
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm"
                            >
                                Home
                            </Button>
                        </Link>
                        <Link href="/projects">
                            <Button
                                variant="outline"
                                className="w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm"
                            >
                                Projects
                            </Button>
                        </Link>
                        <Link href="/blog">
                            <Button
                                variant="outline"
                                className="w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm"
                            >
                                Blog
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button
                                variant="outline"
                                className="w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 text-sm"
                            >
                                Contact
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Primary CTA */}
                <Link href="/">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <span>Return Home</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </Link>

                {/* Sitemap Info */}
                <p className="text-xs text-gray-500 dark:text-gray-500 pt-4">
                    Can't find what you're looking for?{' '}
                    <Link href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">
                        Get in touch
                    </Link>
                </p>
            </div>
        </div>
    );
}
