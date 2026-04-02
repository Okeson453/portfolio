import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SecurityProvider } from '@/components/providers/SecurityProvider';
import { ClientInitializer } from '@/components/providers/ClientInitializer';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import { reportWebVitals } from '@/lib/web-vitals';
import { siteConfig } from '@/lib/seo';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { SchemaScript, generatePersonSchema, generateWebsiteSchema } from '@/lib/schema';
import './globals.css';

// Export Web Vitals reporter for app-level tracking
export { reportWebVitals };

// System font stacks with CSS variables (no external network calls during build)
// Using system fonts provides fast loading with optional web font enhancement post-deployment
const fontVariables = {
  inter: 'var(--font-inter)',
  jetbrainsMono: 'var(--font-jetbrains-mono)',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.fullName, url: siteConfig.url }],
  creator: siteConfig.fullName,

  // Canonical URL
  alternates: {
    canonical: siteConfig.url,
    types: {
      'application/rss+xml': `${siteConfig.url}/feed.xml`,
    },
  },

  // Open Graph — controls LinkedIn, Facebook, Slack previews
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.ogImageAlt,
        type: 'image/png',
      },
    ],
  },

  // Twitter/X Card
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle || '@okeson_dev',
    site: siteConfig.twitterHandle || '@okeson_dev',
  },

  // Robots directive
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification tokens (add after registering in each console)
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN',
    // bing: process.env.BING_VERIFICATION,
  },

  // App manifest for PWA support
  manifest: '/manifest.json',

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  other: {
    'color-scheme': 'light dark',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PERFORMANCE OPTIMIZATION: Resource Hints */}
        {/* ═══════════════════════════════════════════════════════════ */}

        {/* RSS Feed Link */}
        <link 
          rel="alternate" 
          type="application/rss+xml" 
          href="/feed.xml" 
          title="Security Blog RSS Feed" 
        />

        {/* Analytics (non-critical but should preconnect) */}
        <link rel="preconnect" href="https://api.vercel-insights.com" crossOrigin="anonymous" />

        {/* DNS Prefetch for other external services */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STRUCTURED DATA: Person & Site Schema (Global) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <SchemaScript 
          schema={[
            generatePersonSchema(),
            generateWebsiteSchema()
          ]}
        />
      </head>
      <body className="font-sans bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased min-h-screen">
        <ThemeProvider>
          <SecurityProvider>
            <QueryClientProvider client={queryClient}>
              {/* Initialize client services (monitoring, PWA, etc.) */}
              <ClientInitializer />

              {/* Skip to main content — visible on keyboard focus,  hidden otherwise */}
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>

              {/* Offline indicator banner */}
              <OfflineBanner />

              <div className="relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern pointer-events-none" />
                <div className="relative z-10">
                  <Navigation />
                  <main id="main-content" tabIndex={-1} className="min-h-screen">
                    {children}
                  </main>
                  <Footer />
                </div>
              </div>
              <Toaster />

              {/* Command Palette (Cmd+K) */}
              <CommandPalette />

              {/* Global UI Components */}
              {/* <GlobalUIComponents /> */}
            </QueryClientProvider>
          </SecurityProvider>
        </ThemeProvider>
        {/* ✅ Vercel Analytics - Production metrics collection */}
        <Analytics />
      </body>
    </html >
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PERFORMANCE OPTIMIZATION: Resource Hints */}
        {/* ═══════════════════════════════════════════════════════════ */}

        {/* RSS Feed Link */}
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Blog RSS Feed" />

        {/* Analytics (non-critical but should preconnect) */}
        <link rel="preconnect" href="https://api.vercel-insights.com" crossOrigin="anonymous" />

        {/* DNS Prefetch for other external services */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STRUCTURED DATA: Person & Site Schema */}
        {/* ═══════════════════════════════════════════════════════════ */}

        {/* 🔍 Person Schema — Helps Google understand identity for personal site ranking */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: siteConfig.fullName,
              jobTitle: 'Cybersecurity Engineer & Full-Stack Developer',
              url: siteConfig.url,
              email: 'contact@securestack.dev',
              sameAs: [
                'https://github.com/securestack',
                'https://linkedin.com/in/securestack',
                'https://twitter.com/securestack',
              ],
            }),
          }}
        />

        {/* 🔍 WebSite Schema — Helps Google understand your site globally */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: siteConfig.url,
              name: siteConfig.name,
              description: siteConfig.description,
              author: {
                '@type': 'Person',
                name: siteConfig.fullName,
                url: siteConfig.url,
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${siteConfig.url}/projects?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="font-sans bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased min-h-screen">
        <ThemeProvider>
          <SecurityProvider>
            <QueryClientProvider client={queryClient}>
              {/* Initialize client services (monitoring, PWA, etc.) */}
              <ClientInitializer />

              {/* Skip to main content — visible on keyboard focus,  hidden otherwise */}
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>

              {/* Offline indicator banner */}
              <OfflineBanner />

              <div className="relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern pointer-events-none" />
                <div className="relative z-10">
                  <Navigation />
                  <main id="main-content" tabIndex={-1} className="min-h-screen">
                    {children}
                  </main>
                  <Footer />
                </div>
              </div>
              <Toaster />

              {/* Command Palette (Cmd+K) */}
              <CommandPalette />

              {/* Global UI Components */}
              {/* <GlobalUIComponents /> */}
            </QueryClientProvider>
          </SecurityProvider>
        </ThemeProvider>
        {/* ✅ Vercel Analytics - Production metrics collection */}
        <Analytics />
      </body>
    </html >
  );
}
