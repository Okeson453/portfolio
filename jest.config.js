module.exports = {
    // Environment
    testEnvironment: 'jsdom',
    setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],

    // Discovery — explicit patterns prevent accidentally running e2e
    testMatch: [
        '<rootDir>/tests/**/*.test.ts',
        '<rootDir>/tests/**/*.test.tsx',
        '<rootDir>/components/**/*.test.tsx',
        '<rootDir>/hooks/**/*.test.ts',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/.next/',
        '/tests/e2e/',
        '/playwright/',
    ],

    // Coverage — only collect when explicitly requested (speeds up test:fast)
    collectCoverageFrom: [
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'app/**/*.{ts,tsx}',
        '!**/*.d.ts',
        '!**/*.stories.{ts,tsx}',
        '!**/index.ts',         // barrel files — not worth testing
        '!app/api/**/*.ts',     // integration-test API routes separately
    ],

    // Coverage thresholds — enforced in CI
    // Target: raise to 70% within 60 days
    coverageThreshold: {
        global: {
            branches:   40,
            functions:  40,
            lines:      40,
            statements: 40,
        },
    },

    coverageReporters: ['text-summary', 'lcov', 'html'],
    coverageDirectory: 'coverage',

    // Performance
    maxWorkers: '75%',        // leave 25% for system
    cache: true,
    cacheDirectory: '<rootDir>/.jest-cache',

    // Module resolution — mirrors tsconfig paths
    moduleNameMapper: {
        '^@/components/(.*)$':     '<rootDir>/components/$1',
        '^@/app-components/(.*)$': '<rootDir>/app/components/$1',
        '^@/lib/(.*)$':            '<rootDir>/lib/$1',
        '^@/hooks/(.*)$':          '<rootDir>/hooks/$1',
        '^@/types$':               '<rootDir>/types/index.ts',
        '^@/types/(.*)$':          '<rootDir>/types/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transformIgnorePatterns: [
        '/node_modules/(?!(react-hot-toast|@vercel)/)',
    ],

    // Suppress noisy output in watch mode
    verbose: false,
    silent: false,

    // Fail fast in CI — don't accumulate all failures
    bail: process.env.CI ? 3 : 0,
};
