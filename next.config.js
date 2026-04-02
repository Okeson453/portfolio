/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // ===== STRICT MODE & SECURITY =====
  // Disable strict mode in development for faster rebuilds
  reactStrictMode: !isDev,
  poweredByHeader: false,

  // Allow dev server to work from different origins
  allowedDevOrigins: ['192.168.119.53', 'localhost'],

  // ===== BUILD OPTIMIZATION =====
  // Use standalone output for smaller, optimized builds
  output: 'standalone',

  // Disable compression in dev for faster builds
  compress: !isDev,

  // Disable source maps in production (smaller bundle)
  productionBrowserSourceMaps: false,

  // ===== EXPERIMENTAL OPTIMIZATIONS =====
  experimental: {
    // Parallel compilation — uses all CPU cores
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
    
    // Package import optimization - only in production
    ...(isDev ? {} : {
      optimizePackageImports: [
        'lucide-react',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-label',
        '@radix-ui/react-radio-group',
        '@radix-ui/react-select',
        '@radix-ui/react-slot',
        '@radix-ui/react-switch',
        'date-fns',
        '@radix-ui/react-icons',
        'recharts',
      ],
    }),
  },

  // ===== WEBPACK & BUILD OPTIMIZATION =====
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Use memory cache for MUCH faster dev rebuilds
      config.cache = {
        type: 'memory',
        maxAge: 1000 * 60 * 60, // 1 hour
      };

      // Parallelize builds on multi-core systems
      config.parallelism = require('os').cpus().length;
    } else if (!isServer) {
      // Production: use filesystem cache
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }

    return config;
  },

  // ===== IMAGE OPTIMIZATION =====
  images: {
    // In dev: use fewer formats for faster optimization
    formats: isDev ? ['image/webp'] : ['image/avif', 'image/webp'],

    // Remote images from any domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],

    // Optimize for different devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache optimized images for 1 year (immutable)
    minimumCacheTTL: 31536000,

    // Dangerously allow SVG
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ===== ON-DEMAND ENTRIES & PRELOADING =====
  onDemandEntries: {
    // Aggressive preloading in development for faster page transitions
    maxInactiveAge: 25 * 1000, // 25 seconds
    pagesBufferLength: 8, // Preload 8 pages
  },

  // ===== PERFORMANCE HEADERS & CACHING STRATEGY =====
  // Skip header processing in dev mode for faster startup
  async headers() {
    // Return early in development to skip expensive header config
    if (isDev) return [];

    return [
      // ===== STATIC ASSETS (IMMUTABLE) =====
      // Static assets – cache forever (1 year)
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Disposition',
            value: 'inline',
          },
        ],
      },

      // Images – long-term cache (1 year)
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      // Next.js optimized assets – immutable (1 year)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      // ===== DYNAMIC ASSETS =====
      // HTML pages – short cache with stale-while-revalidate
      {
        source: '/(.*)\\.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },

      // API responses – cache per endpoint needs
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
          },
        ],
      },

      // ===== SECURITY & PERFORMANCE HEADERS (ALL ROUTES) =====
      {
        source: '/(.*)',
        headers: [
          // === PERFORMANCE HEADERS ===
          // Enable DNS prefetching
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },

          // Enable compression (already done via compress: true)
          {
            key: 'X-Compression',
            value: 'gzip',
          },

          // === SECURITY HEADERS ===
          // HSTS – force HTTPS for 1 year + subdomains
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },

          // Prevent framing in iframes
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },

          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          // Prevent XSS attacks
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },

          // Referrer policy – stricter for cross-origin
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          // Restrict permissions
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },

          // === CONTENT SECURITY POLICY ===
          // Restrictive CSP for security
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' challenges.cloudflare.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: blob:;
              font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com;
              connect-src 'self' *.algolia.net *.algolianet.com api.openai.com *.upstash.io;
              frame-src challenges.cloudflare.com;
              report-uri /api/security/csp-report;
            `.replace(/\s+/g, ' ').trim(),
          },
        ],
      },

      // ===== FONT OPTIMIZATION =====
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },

  // ===== REDIRECTS FOR SEO =====
  async redirects() {
    // Skip redirects in dev mode for faster startup
    if (isDev) return [];

    return [
      {
        source: '/blog/:slug',
        destination: '/writeups/:slug',
        permanent: true,
      },
      // Redirect old portfolio URL
      {
        source: '/old-site',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // ===== REWRITES (INTERNAL ROUTING) =====
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite robots.txt
        {
          source: '/robots.txt',
          destination: '/api/robots',
        },
        // Rewrite sitemap.xml
        {
          source: '/sitemap.xml',
          destination: '/api/sitemap',
        },
      ],
    }
  },

  // ===== INTERNATIONALIZATION (IF NEEDED) =====
  // i18n: {
  //   locales: ['en', 'es', 'fr'],
  //   defaultLocale: 'en',
  // },

  // ===== COMPILER OPTIMIZATIONS =====
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',

    // Remove React.StrictMode wrapper (optional, but can improve performance)
    // NOTE: Keep this disabled for development to catch issues
  },

  // ===== ESLINT & TYPE CHECK =====
  eslint: {
    // Skip ESLint in dev for faster builds
    ignoreDuringBuilds: isDev,
    dirs: isDev ? [] : ['app', 'components', 'lib', 'hooks'],
  },

  typescript: {
    // Skip TypeScript checks during dev builds
    tsconfigPath: './tsconfig.json',
    ignoreBuildErrors: isDev,
  },

  // ===== TURBOPACK CONFIGURATION =====
  turbopack: {
    root: __dirname,
  },

  // ===== LOGGING & MONITORING =====
  // Uncomment to see detailed build output
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
}

// ===== BUNDLE ANALYZER =====
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// ===== PWA CONFIGURATION =====
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: false,
  sw: 'sw.js',
  cacheStartUrl: true,
  reloadOnOnline: true,
  dynamicStartUrl: false,
  dynamicStartUrlRedirect: '/offline',
  fallbacks: {
    image: '/images/placeholder.png',
    document: '/offline.html',
  },
  publicExcludes: ['!noprecache/**/*'],
  buildExcludes: [/middleware_manifest\.json$/],
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          maxEntries: 30,
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\/.*\$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxAgeSeconds: 60 * 5, // 5 minutes
          maxEntries: 50,
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\.(js|css|ts|tsx)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(?:png|gif|jpg|jpeg|webp|svg)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          maxEntries: 60,
        },
      },
    },
  ],
})

module.exports = withBundleAnalyzer(withPWA(nextConfig))