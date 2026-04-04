# Project Architecture

Overview of the portfolio's structure and design patterns.

## Directory Structure

```
portfolio/
├── app/                      # Next.js App Router (pages, layouts, API routes)
│   ├── (routes)/            # Route groups (about, projects, blog, contact, etc.)
│   ├── api/                 # API routes (contact, cron jobs, webhooks)
│   ├── layout.tsx           # Root layout (metadata, providers)
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
│
├── components/              # Reusable React components
│   ├── Hero.tsx
│   ├── Projects.tsx
│   ├── Skills.tsx
│   ├── Contact.tsx
│   ├── Navigation.tsx
│   └── ui/                  # shadcn/ui components
│
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   └── useTheme.ts
│
├── lib/                     # Utility functions
│   ├── auth/               # JWT authentication
│   ├── security/           # Security helpers (rate limiting, validation)
│   ├── db.ts               # Prisma client
│   ├── utils.ts            # General utilities
│   └── seo.ts              # SEO configuration
│
├── prisma/                 # Database
│   ├── schema.prisma       # Data model
│   └── migrations/         # Database migrations
│
├── public/                 # Static assets
│   ├── images/
│   ├── icons/
│   └── robots.txt
│
├── tests/                  # Test suite
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── e2e/               # End-to-end tests (Playwright)
│
├── types/                  # TypeScript type definitions
│   └── index.ts
│
├── docs/                   # Documentation (this folder)
│
└── .github/                # GitHub configuration
    ├── workflows/         # CI/CD pipelines
    └── ISSUE_TEMPLATE/    # Issue templates
```

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | React | 19.0.0 |
| **Framework** | Next.js | 15.1.7 (App Router) |
| **Language** | TypeScript | 5.x (strict mode) |
| **Styling** | Tailwind CSS | 3.4.17 |
| **Components** | Radix UI + shadcn/ui | Latest |
| **Database** | PostgreSQL + Prisma | 5.x |
| **Auth** | JWT (jose) | 6.1.3 |
| **Password Hashing** | bcryptjs | 3.0.3 |
| **Email** | Resend | 4.0.1 |
| **Search** | Algolia | Latest |
| **Rate Limiting** | Upstash Redis | Latest |
| **Error Tracking** | Sentry | 8.0.0 |
| **Testing** | Jest + Playwright | Latest |
| **Linting** | ESLint 9 (flat config) | 9.17.0 |
| **Formatting** | Prettier | 3.4.2 |
| **Deployment** | Vercel | Official platform |

## Key Design Decisions

### Server Components (Default)

React Server Components are used by default in Next.js App Router:
- Components are server-rendered (faster, smaller bundles)
- Use `'use client'` directive only for interactive components
- Reduces JavaScript sent to the browser

### API Routes Pattern

All API endpoints are in `app/api/`:
- Each endpoint is a Route Handler (`route.ts`)
- Uses middleware for security (rate limiting, auth checks)
- Returns JSON responses

### Authentication Flow

1. User logs in via `/login` page
2. Server validates credentials, issues JWT token
3. JWT stored in secure HTTP-only cookie
4. Middleware checks JWT on protected routes (`/dashboard`, `/admin`)
5. Payload added to request for downstream use

### Rate Limiting

Implemented in `middleware.ts`:
- Uses Upstash Redis (cloud rate limiting)
- Falls back to in-memory cache if Redis unavailable
- Different limits per endpoint (login: 5/10min, contact: 3/5min)

### Security Headers

Applied globally via middleware:
- CSP (Content Security Policy)
- HSTS (Strict-Transport-Security)
- X-Frame-Options, X-Content-Type-Options
- No user IDs exposed in headers

## Data Flow

```
User Request
    ↓
[Middleware] — rate limit check, security headers, auth check
    ↓
[Route Handler or Server Component]
    ↓
[Prisma ORM] → PostgreSQL
    ↓
Response (JSON or HTML)
```

## Deployment

### Vercel Deployment

- Automatic deployments on every push to `main`
- Environment variables configured in Vercel dashboard
- Edge runtime for middleware
- Node.js runtime for API routes
- Build optimization via Turbopack

### Database

- Hosted PostgreSQL (Vercel Postgres, Supabase, AWS RDS, etc.)
- Prisma ORM for type-safe queries
- Migrations tracked in `prisma/migrations/`

## Performance Considerations

1. **Image Optimization** — All images use Next.js `<Image>` component
2. **Code Splitting** — Dynamic imports for large components
3. **CSS-in-JS** — Tailwind CSS (not runtime CSS-in-JS)
4. **Data Fetching** — Server components fetch data directly
5. **Caching** — ISR (Incremental Static Regeneration) for blog posts
6. **Compression** — Enabled in Next.js config

## Contributing

See [docs/CONTRIBUTING.md](./CONTRIBUTING.md)
