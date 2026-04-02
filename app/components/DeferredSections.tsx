'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { DeferredClient } from './DeferredClient'

// Skeletons for streaming fallbacks
const SectionSkeleton = () => (
    <div className="h-96 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 animate-pulse" />
)

// Dynamic imports for interactive components (client-side only)
const PasswordChecker = dynamic(() => import('./PasswordChecker'), {
    loading: () => <SectionSkeleton />,
    ssr: false,
})

const SecurityScanner = dynamic(() => import('./SecurityScanner'), {
    loading: () => <SectionSkeleton />,
    ssr: false,
})

const Testimonials = dynamic(() => import('./Testimonials'), {
    loading: () => <SectionSkeleton />,
    ssr: false,
})

const QuickContact = dynamic(() => import('./QuickContact'), {
    loading: () => <SectionSkeleton />,
    ssr: false,
})

export function DeferredSections() {
    return (
        <>
            {/* Password Checker - deferred interactive component */}
            <DeferredClient fallback={<SectionSkeleton />}>
                <Suspense fallback={<SectionSkeleton />}>
                    <section className="py-20 bg-white dark:bg-gray-900">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
                                <span className="text-gray-900 dark:text-white">Security</span>{' '}
                                <span className="text-blue-500">Tools</span>
                            </h2>
                            <PasswordChecker />
                        </div>
                    </section>
                </Suspense>
            </DeferredClient>

            {/* Security Scanner - deferred interactive component */}
            <DeferredClient fallback={<SectionSkeleton />}>
                <Suspense fallback={<SectionSkeleton />}>
                    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <SecurityScanner />
                        </div>
                    </section>
                </Suspense>
            </DeferredClient>

            {/* Testimonials - deferred interactive component */}
            <DeferredClient fallback={<SectionSkeleton />}>
                <Suspense fallback={<SectionSkeleton />}>
                    <section className="py-20 bg-white dark:bg-gray-900">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
                                <span className="text-gray-900 dark:text-white">What</span>{' '}
                                <span className="text-blue-500">Others Say</span>
                            </h2>
                            <Testimonials />
                        </div>
                    </section>
                </Suspense>
            </DeferredClient>

            {/* Quick Contact - deferred interactive component */}
            <DeferredClient fallback={<SectionSkeleton />}>
                <Suspense fallback={<SectionSkeleton />}>
                    <section className="py-20 bg-white dark:bg-gray-900">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
                                <span className="text-gray-900 dark:text-white">Get in</span>{' '}
                                <span className="text-blue-500">Touch</span>
                            </h2>
                            <QuickContact />
                        </div>
                    </section>
                </Suspense>
            </DeferredClient>
        </>
    )
}
