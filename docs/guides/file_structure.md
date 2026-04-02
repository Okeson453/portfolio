# Project File Structure

**Root:** `C:\Users\pc\Desktop\portfolio`  
**Generated:** 2026-03-30 20:50:12  
**Ignored patterns:** `*.egg-info, *.log, *.pyc, *.pyo, *.tmp, .DS_Store, .cache, .git, .github, .hg, .husky, .idea, .mypy_cache, .netlify, .next, .nyc_output, .pytest_cache, .ruff_cache, .svn, .venv, .vercel, .vs, .vscode, Thumbs.db, __pycache__, build, coverage, dist, env, node_modules, out, venv`
**Options:** depth=unlimited, show_sizes=False, gitignore=False

portfolio/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   └── session/
│   │   │       └── route.ts
│   │   ├── metrics/
│   │   │   └── route.ts
│   │   ├── og/
│   │   │   └── blog/
│   │   │       └── route.tsx
│   │   └── timeline-example/
│   │       └── route.ts
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   ├── devsecops-fintech.mdx
│   │   ├── page.tsx
│   │   ├── security-mistakes.mdx
│   │   └── vulnerability-scanner.mdx
│   ├── components/
│   │   ├── compliance/
│   │   │   └── ComplianceBadge.tsx
│   │   ├── error/
│   │   │   └── ErrorBoundary.tsx
│   │   ├── providers/
│   │   │   ├── CSPNonceProvider.tsx
│   │   │   ├── PerformanceProvider.tsx
│   │   │   └── SecurityProvider.tsx
│   │   ├── security/
│   │   │   ├── SecurityStatusBar.tsx
│   │   │   └── ThreatIntelligenceFeed.tsx
│   │   ├── ui/
│   │   │   ├── Badge.tsx
│   │   │   ├── BlogPostSkeleton.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ProjectCardSkeleton.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── Typewriter.tsx
│   │   ├── About.tsx
│   │   ├── Blog.tsx
│   │   ├── ClientComponents.tsx
│   │   ├── Contact.tsx
│   │   ├── DeferredClient.tsx
│   │   ├── DeferredSections.tsx
│   │   ├── Experience.tsx
│   │   ├── Footer.tsx
│   │   ├── GlobalUIComponents.tsx
│   │   ├── Hero.tsx
│   │   ├── Navigation.tsx
│   │   ├── PasswordChecker.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── Projects.tsx
│   │   ├── QuickContact.tsx
│   │   ├── SecurityScanner.tsx
│   │   ├── Skills.tsx
│   │   ├── Testimonials.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── Timeline.tsx
│   ├── contact/
│   │   ├── actions.ts
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── experience/
│   │   └── page.tsx
│   ├── hooks/
│   │   └── useInView.ts
│   ├── login/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   ├── projects/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── security/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── settings/
│   │   ├── appearance/
│   │   │   └── page.tsx
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── security/
│   │   │   ├── activity/
│   │   │   │   └── page.tsx
│   │   │   ├── devices/
│   │   │   │   └── page.tsx
│   │   │   ├── two-factor/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── skills/
│   │   └── page.tsx
│   ├── terms/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── opengraph-image.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx
│   ├── dynamic/
│   │   ├── Projects.tsx
│   │   └── ProjectsContent.tsx
│   ├── settings/
│   │   ├── AvatarUpload.tsx
│   │   ├── DeviceList.tsx
│   │   ├── NotificationToggles.tsx
│   │   ├── PasswordChange.tsx
│   │   ├── PrivacyControls.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── SecurityActivityLog.tsx
│   │   ├── SettingsCard.tsx
│   │   ├── SettingsSidebar.tsx
│   │   ├── ThemeSelector.tsx
│   │   ├── TwoFactorSetup.tsx
│   │   └── TwoFactorStatus.tsx
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── BlogPostSkeleton.tsx
│   │   ├── Button.tsx
│   │   ├── DropdownMenu.tsx
│   │   ├── Input.tsx
│   │   ├── Label.tsx
│   │   ├── ProjectCardSkeleton.tsx
│   │   ├── RadioGroup.tsx
│   │   ├── Select.tsx
│   │   ├── skeleton.tsx
│   │   ├── Switch.tsx
│   │   ├── Textarea.tsx
│   │   └── Typewriter.tsx
│   ├── OptimizedImage.module.css
│   └── OptimizedImage.tsx
├── docs/
│   ├── deployment/
│   │   ├── DEPLOYMENT_CHECKLIST.md
│   │   └── DEPLOYMENT_GUIDE.md
│   ├── features/
│   │   ├── PORTFOLIO_FEATURES.md
│   │   └── SETTINGS_MODULE.md
│   ├── guides/
│   │   └── KEYBOARD_SHORTCUTS_GUIDE.md
│   ├── performance/
│   │   ├── BUNDLE_OPTIMIZATION_REPORT.md
│   │   ├── PERFORMANCE.md
│   │   ├── PERFORMANCE_CHECKLIST.md
│   │   ├── PERFORMANCE_SETUP.md
│   │   └── README_PERFORMANCE.md
│   ├── DOCS_GUIDE.md
│   ├── INDEX.md
│   ├── README.md
│   └── STRUCTURE.md
├── hooks/
│   ├── index.ts
│   ├── useAuth.ts
│   ├── useFocusTrap.ts
│   ├── useInView.ts
│   ├── useProfile.ts
│   ├── useSettings.ts
│   ├── useTheme.ts
│   ├── useToast.ts
│   └── useTwoFactor.ts
├── lib/
│   ├── actions/
│   │   └── contact.ts
│   ├── auth/
│   │   ├── session.ts
│   │   └── tokens.ts
│   ├── db/
│   │   └── client.ts
│   ├── performance/
│   │   └── image-optimization.ts
│   ├── security/
│   │   ├── auth/
│   │   │   └── middleware.ts
│   │   ├── encryption.ts
│   │   ├── rateLimiter.ts
│   │   └── sanitization.ts
│   ├── services/
│   │   ├── securityService.ts
│   │   └── settingsService.ts
│   ├── validators/
│   │   └── settingsSchema.ts
│   ├── blog.ts
│   ├── cache.ts
│   ├── experienceData.ts
│   ├── index.ts
│   ├── projectsData.ts
│   ├── seo.ts
│   ├── skillsData.ts
│   ├── utils.ts
│   ├── uuid.ts
│   └── web-vitals.ts
├── public/
│   ├── images/
│   │   ├── blog/
│   │   │   ├── devsecops.jpg
│   │   │   ├── mistakes.jpg
│   │   │   └── scanner.jpg
│   │   ├── projects/
│   │   │   ├── api-security-tools.png
│   │   │   ├── data-dashboard.png
│   │   │   ├── ecommerce-platform.png
│   │   │   ├── expense-tracker.png
│   │   │   └── vulnerability-scanner.png
│   │   ├── cyber-cityscape.jpg
│   │   └── profile.jpg
│   ├── favicon.ico
│   └── resume.pdf
├── scripts/
│   ├── generate-og-image.js
│   ├── performance-audit.ps1
│   ├── performance-audit.sh
│   └── performance-check.js
├── src/
│   └── components/
│       ├── BackToTop.tsx
│       ├── CommandPalette.tsx
│       ├── CopyButton.tsx
│       ├── LazySection.tsx
│       ├── OptimizedImage.tsx
│       ├── PasswordChecker.tsx
│       ├── Projects.tsx
│       ├── QuickContact.tsx
│       ├── ScrollProgress.tsx
│       ├── SecurityScanner.tsx
│       ├── ShortcutGuide.tsx
│       ├── Testimonials.tsx
│       └── Timeline.tsx
├── tests/
│   └── auth/
│       └── login.test.ts
├── types/
│   ├── cache.types.ts
│   ├── experience.ts
│   ├── metrics.types.ts
│   ├── projects.ts
│   └── skills.ts
├── .env.example
├── .env.local
├── .eslintrc.json
├── .gitignore
├── .markdownlint.json
├── .prettierignore
├── .prettierrc
├── ACTION_PLAN.md
├── AUDIT_SUMMARY.md
├── auto-fix.js
├── build-output.txt
├── check-performance.js
├── check_structure.py
├── COMMANDS_REFERENCE.md
├── COMPLETE_DEPLOYMENT_GUIDE.md
├── DEPLOYMENT_CHECKLIST.md
├── DEPLOYMENT_COMMANDS.md
├── DEPLOYMENT_COMPLETE_SETUP.md
├── DEPLOYMENT_FILES_CHECKLIST.md
├── DEPLOYMENT_FILES_INDEX.md
├── DEPLOYMENT_INTERACTIVE_CHECKLIST.md
├── DEPLOYMENT_QUICK_START.md
├── DEPLOYMENT_START_HERE.md
├── DEPLOYMENT_STATUS.md
├── DEPLOYMENT_STATUS_SEO.md
├── DEPLOYMENT_SUMMARY.md
├── docker-compose.yml
├── Dockerfile
├── ENTERPRISE_AUDIT_REPORT_COMPLETE.md
├── ENV_SETUP.md
├── eslint.config.mjs
├── file_structure.md
├── GITHUB_SETUP.md
├── LICENSE
├── measure-performance.js
├── middleware.ts
├── netlify.toml
├── next-env.d.ts
├── next.config.js
├── OPTIMIZATION_CHANGES.md
├── package-lock.json
├── package.json
├── PERFORMANCE_CHECKLIST.md
├── PERFORMANCE_IMPLEMENTATION.md
├── PERFORMANCE_OPTIMIZATIONS.md
├── PERFORMANCE_TESTING.md
├── PHASE_1_IMPLEMENTATION_CHECKLIST.md
├── PORTFOLIO_ENTERPRISE_AUDIT_REPORT.md
├── postcss.config.js
├── QUICK_DEPLOY.md
├── QUICK_REFERENCE.md
├── QUICK_REFERENCE_SEO.md
├── README.md
├── SEO_IMPLEMENTATION.md
├── SEO_VERIFICATION_GUIDE.md
├── setup.py
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vercel.json

