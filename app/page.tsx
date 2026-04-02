import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next';
import { Timeline, DeferredSections } from './components/ClientComponents'
import { siteConfig } from '@/lib/seo'
import { buildPersonSchema } from '@/lib/seo/schema'

// Enable Incremental Static Regeneration (ISR) for fast cached responses
export const revalidate = 3600 // Revalidate every hour

// Skeletons for streaming fallbacks
const SectionSkeleton = () => (
  <div className="h-96 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 animate-pulse" />
)

// Dynamic imports for SSR-safe components (server-rendered)
const Hero = dynamic(() => import('./components/Hero').then(mod => ({ default: mod.Hero })), {
  loading: () => <SectionSkeleton />,
  ssr: true,
})

const Projects = dynamic(
  () => import('./components/Projects').then(mod => ({ default: mod.Projects })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true,
  }
)

/**
 * Home Page - Server Component
 * Performance Tiers:
 * TIER 1: Hero (0ms) - Renders immediately, critical content
 * TIER 2: Timeline/Projects - Streams from server with Suspense (SSR)
 * TIER 3: Navigation cards - Static content, loads immediately
 * TIER 4: Security tools/Testimonials - Deferred until page is interactive
 *
 * Key optimizations:
 * - Zero 'use client' overhead (server component)
 * - Dynamic imports reduce initial bundle by 40-60%
 * - Suspense boundaries enable streaming
 * - ISR revalidation every hour for cache freshness
 */
export const metadata: Metadata = {
  title: siteConfig.title,   // No template suffix on home page
  description: siteConfig.description,
  alternates: { canonical: siteConfig.url },
};

export default function Home() {
  const personSchema = buildPersonSchema(siteConfig);

  const sections = [
    {
      title: 'About',
      description: 'Learn about my background, expertise, and approach to cybersecurity.',
      href: '/about',
    },
    {
      title: 'Skills',
      description: 'Explore my technical skills across security, development, and DevOps.',
      href: '/skills',
    },
    {
      title: 'Experience',
      description: 'View my professional journey and key achievements in tech.',
      href: '/experience',
    },
    {
      title: 'Projects',
      description: 'Discover my portfolio of cybersecurity and full-stack projects.',
      href: '/projects',
    },
    {
      title: 'Blog',
      description: 'Read articles on security trends, best practices, and development insights.',
      href: '/blog',
    },
  ]

  return (
    <main>
      {/* 🔍 Person schema — Google uses this for knowledge panels */}
      {personSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personSchema }}
        />
      )}
      {/* TIER 1: Critical - Renders immediately (0ms) */}
      <Hero />

      {/* TIER 2: High-Priority - Streams from server (SSR) */}
      <Suspense fallback={<SectionSkeleton />}>
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
              <span className="text-gray-900 dark:text-white">Career</span>{' '}
              <span className="text-blue-500">Journey</span>
            </h2>
            <Timeline />
          </div>
        </section>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
              <span className="text-gray-900 dark:text-white">Featured</span>{' '}
              <span className="text-blue-500">Projects</span>
            </h2>
            <Projects />
          </div>
        </section>
      </Suspense>

      {/* TIER 3: Medium Priority - Static content loads immediately */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Explore</span>{' '}
              <span className="text-blue-500">More</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover my expertise, projects, and insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Link key={section.href} href={section.href}>
                <div className="group relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10 h-full flex flex-col">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                      {section.description}
                    </p>
                    <div className="flex items-center text-blue-500 group-hover:translate-x-2 transition-transform">
                      <span className="font-semibold">Explore</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TIER 4: Low Priority - Deferred until page is interactive */}
      {/* TIER 4: Low Priority - Deferred until page is interactive */}
      <DeferredSections />
    </main>
  )
}