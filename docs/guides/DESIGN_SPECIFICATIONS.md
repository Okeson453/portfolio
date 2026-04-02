# Design Specifications - Secure Stack Portfolio

## 1. Project Overview

The Secure Stack Portfolio is a modern, cybersecurity-focused portfolio website built with Next.js, featuring interactive UI components, security visualizations, and best practices for protective design patterns.

### Core Technologies
- **Framework**: Next.js 15.1.7 with Turbopack
- **Styling**: Tailwind CSS with custom animations
- **Components**: React 19.0.0 with TypeScript
- **Forms**: React Hook Form with Zod validation
- **UI Library**: Radix UI components
- **Email**: EmailJS for contact form submissions
- **Database**: Prisma with SQLite/PostgreSQL support

## 2. Visual Design System

### Brand Colors
- **Primary Dark**: `#0f172a` (Slate 900) - Main background
- **Primary Blue**: `#1e40af` (Blue 800) - Primary actions
- **Cyan Accent**: `#06b6d4` (Cyan 500) - Highlights
- **Success Green**: `#10b981` (Emerald 500) - Status indicators
- **Warning Red**: `#ef4444` (Red 500) - Errors/alerts
- **Text Light**: `#e2e8f0` (Slate 100) - Primary text
- **Text Muted**: `#94a3b8` (Slate 400) - Secondary text

### Typography
- **Headlines**: Inter, Bold (600-700 weight)
- **Body**: Inter, Regular (400-500 weight)
- **Monospace**: Fira Code for code snippets
- **Mobile**: Font size scaling 75% on smaller screens
- **Line Height**: 1.6 base, 1.2 for headlines

### Spacing System
- **Base Unit**: 8px
- **Common Spacing**: 16px, 24px, 32px, 48px, 64px
- **Container Max Width**: 1280px (xl Tailwind breakpoint)
- **Gutter Width**: 24px (responsive 16px on mobile)

## 3. Component Specifications

### Navigation Component
- **Type**: Fixed header with sticky positioning
- **Height**: 64px (desktop), 56px (mobile)
- **Logo Size**: 40px x 40px
- **Link Styling**: Hover state with cyan underline animation
- **Mobile**: Hamburger menu at 640px breakpoint
- **Z-Index**: 50 (stays above content)

### Hero Section
- **Type**: Full viewport height banner (100vh min)
- **Background**: 
  - Gradient overlay: Dark to transparent
  - Optional animated background pattern
- **Content Alignment**: Center-left on desktop, center on mobile
- **CTA Buttons**: Two action buttons with hover states
- **Animation**: Fade-in on page load

### Project Grid
- **Desktop Columns**: 4 columns (1280px+)
- **Tablet Columns**: 2 columns (640-1023px)
- **Mobile Columns**: 1 column (<640px)
- **Card Height**: Auto with aspect-ratio maintained
- **Hover Effect**: Scale 1.05 with shadow elevation
- **Image Aspect Ratio**: 16:9

### Skills Section
- **Categories**: Organized by technology domains
- **Badge Style**: Pill-shaped with borders
- **Proficiency Levels**: 1-5 stars or percentage
- **Icons**: Lucide React icons (24x24px)
- **Layout**: Grid responsive (2-col on desktop, 1-col mobile)

### Contact Form
- **Fields**: Name, Email, Subject, Message
- **Validation**: Real-time with Zod schema
- **Success State**: Toast notification
- **Error State**: Inline field errors in red
- **Accessibility**: Full ARIA labels and semantic HTML

### Footer
- **Background**: Darker shade of primary
- **Content**: Links, social media, copyright
- **Colophon**: Built with stack information

## 4. Responsive Design Breakpoints

| Breakpoint | Width | Use Case |
|-----------|-------|----------|
| xs | <640px | Mobile phones |
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large displays |

## 5. Animation Specifications

### Transition Timings
- **Standard**: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- **Quick**: 150ms (micro-interactions)
- **Slow**: 500ms (major transitions)

### Common Animations
- **Fade In**: opacity 0→1 over 300ms
- **Slide Up**: translate Y -20px→0 over 300ms
- **Scale Hover**: scale 1→1.05 on hover
- **Glow**: Box-shadow pulse effect on interactive elements

### Scroll Animations
- Elements fade in when scrolled into view
- Parallax effects for hero image
- Smooth scroll behavior enabled

## 6. Accessibility (WCAG 2.1 AA)

### Semantic HTML
- Proper heading hierarchy (h1-h6)
- Semantic elements: `<nav>`, `<main>`, `<footer>`, `<article>`
- Form labels associated with inputs via `htmlFor`

### ARIA Labels
- Images have alt text descriptions
- Interactive elements have aria-labels
- Live regions for form feedback
- Role attributes where semantic HTML insufficient

### Keyboard Navigation
- Tab order follows visual flow
- Skip to main content link
- Focus visible on all interactive elements
- No keyboard traps

### Color Contrast
- Minimum 4.5:1 for body text
- Minimum 3:1 for large text
- No color-only information conveyance

## 7. Performance Targets

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Load Performance
- **First Contentful Paint**: < 1.5s
- **Total Blocking Time**: < 200ms
- **Time to Interactive**: < 3.5s

### Optimization Strategies
- Image optimization with Next.js Image component
- Code splitting by route
- Minification and compression
- Lazy loading for below-fold content

## 8. Browser Support

### Desktop
- Chrome/Edge: Latest 2 versions (v120+)
- Firefox: Latest 2 versions (v121+)
- Safari: Latest 2 versions (v17+)

### Mobile
- iOS Safari: 12.0+
- Android Chrome: 90+

## 9. SEO & Meta Data

### Open Graph
- og:title, og:description
- og:image (1200x630px recommended)
- og:url, og:type

### Twitter Card
- twitter:card: summary_large_image
- twitter:creator: @handle
- twitter:title, twitter:description

### Structured Data
- Schema.org JSON-LD for Person/Portfolio
- Microdata for contact information

## 10. Version History

- **v1.0.0**: Initial release
  - Core portfolio sections
  - Contact form with validation
  - Dark mode support
  - Mobile responsive design

  