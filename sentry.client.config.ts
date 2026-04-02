import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
    dsn: SENTRY_DSN,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Set `tracePropagationTargets` to control what URLs distributed tracing should be enabled for
    tracePropagationTargets: ["localhost", /^\//],

    // Capture Replay for 10% of all sessions,
    // plus 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    environment: process.env.NODE_ENV,

    // Performance Monitoring
    integrations: [
        new Sentry.Replay({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],

    // Ignore certain errors
    ignoreErrors: [
        // Ignore extension errors
        'top.GLOBALS',
        // Ignore random browser plugins
        'chrome-extension://',
        'moz-extension://',
        // Ignore fetch errors from other domains
        'NetworkError when attempting to fetch resource',
        'Failed to fetch',
        // Ignore expected errors
        'ResizeObserver loop limit exceeded',
    ],
});
