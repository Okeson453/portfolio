# 📋 Commands & File Structure Reference

## 🗂️ COMPLETE FILE STRUCTURE

```
portfolio/
│
├─ 📂 .github/
│  └─ 📂 workflows/
│     ├─ test.yml                    ← Auto-run tests on push
│     ├─ deploy-vercel.yml           ← Auto-deploy to Vercel
│     └─ deploy-netlify.yml          ← Auto-deploy to Netlify
│
├─ 📂 app/
│  ├─ page.tsx                       ← Homepage
│  ├─ layout.tsx                     ← Root layout
│  ├─ 📂 api/                        ← Backend routes
│  ├─ 📂 about/
│  ├─ 📂 projects/
│  └─ 📂 contact/
│
├─ 📂 components/
│  ├─ header.tsx
│  ├─ footer.tsx
│  ├─ navbar.tsx
│  └─ (all other UI components)
│
├─ 📂 lib/
│  ├─ seo.ts                         ← SEO configuration
│  └─ (utilities & helpers)
│
├─ 📂 hooks/                         ← Custom React hooks
│ 
├─ 📂 public/
│  ├─ 📂 images/
│  ├─ 📂 fonts/
│  └─ favicon.ico
│
├─ 📂 styles/
│  └─ globals.css                    ← Global styles
│
├─ 📂 types/                         ← TypeScript types
│
├─ 📂 scripts/                       ← Build scripts
│
├─ 📄 package.json                   ← Dependencies ⭐
├─ 📄 package-lock.json              ← Lock file
├─ 📄 tsconfig.json                  ← TypeScript config ⭐
├─ 📄 next.config.js                 ← Next.js config ⭐
├─ 📄 tailwind.config.ts             ← Tailwind CSS
├─ 📄 postcss.config.js              ← CSS processing
├─ 📄 eslint.config.mjs              ← ESLint rules
├─ 📄 .prettierrc                    ← Code formatter
│
├─ 📄 vercel.json                    ← Vercel config ⭐ NEW
├─ 📄 netlify.toml                   ← Netlify config ⭐ NEW
│
├─ 📄 Dockerfile                     ← Docker image
├─ 📄 docker-compose.yml             ← Local compose
├─ 📄 .dockerignore
│
├─ 📄 .gitignore                     ← Git exclusions
├─ 📄 .env.example                   ← Env template
│
├─ 📄 QUICK_DEPLOY.md                ← 5-min deploy guide ⭐ NEW
├─ 📄 COMPLETE_DEPLOYMENT_GUIDE.md   ← Full documentation ⭐ NEW
├─ 📄 DEPLOYMENT_FILES_CHECKLIST.md  ← File checklist ⭐ NEW
├─ 📄 COMMANDS_REFERENCE.md          ← This file ⭐ NEW
│
└─ 📄 LICENSE

❌ NEVER COMMIT:
├─ .env
├─ .env.local
├─ .venv/
├─ node_modules/
└─ .next/
```

---

## ⚡ ESSENTIAL COMMANDS

### 📥 Installation & Setup
```powershell
# Install dependencies
npm install

# Install specific package
npm install package-name

# Update all packages
npm update

# Clean install (remove node_modules first)
npm ci
```

### 🔨 Development

```powershell
# Start dev server (http://localhost:3000)
npm run dev

# Safe dev (with TypeScript checking)
npm run dev:safe

# Type checking in watch mode
npm run type-check:watch

# Format code
npm run format

# Fix ESLint
npm run lint:fix
```

### 🏗️ Building & Testing

```powershell
# Production build
npm run build

# Test production build locally
npm run start

# Type checking
npm run type-check

# Linting
npm run lint

# Tests
npm run test
npm run test:watch

# Security
npm audit

# Performance
npm run analyze
```

### 🚀 Deployment

```powershell
# Build then start (production)
npm run build && npm run start

# Clear cache and rebuild
rm -r .next node_modules
npm ci
npm run build

# Check for security issues
npm audit
npm audit fix
```

---

## 🔑 Environment Variables

### Create `.env.local` (Never commit!)

```env
# Application
NEXT_PUBLIC_APP_URL=https://yoursite.com
NEXT_PUBLIC_API_URL=https://yoursite.com/api
NODE_ENV=production

# Security (Generate with openssl rand -hex 32)
JWT_SECRET=<32-char-hex-string>
CSRF_SECRET=<32-char-hex-string>
SESSION_SECRET=<32-char-hex-string>

# Email (if using Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yoursite.com

# Optional: Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Optional: OAuth
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

### Environment Variable Rules:

```
NEXT_PUBLIC_* = Visible in browser (use for public values)
(no prefix)    = Server-side only (use for secrets)
```

---

## 📂 Git Commands

### Setup Repository

```powershell
# Initialize git
git init

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

# Check remote
git remote -v
```

### Daily Work

```powershell
# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Descriptive message"

# Push to GitHub
git push

# Pull latest
git pull

# Check history
git log --oneline
```

### Branches

```powershell
# Create new branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# List branches
git branch -a

# Delete branch
git branch -d branch-name

# Merge branch
git merge feature/new-feature
```

### Fixing Mistakes

```powershell
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo changes to file
git restore filename.ts

# See what changed
git diff
```

---

## 🐳 Docker Commands

### Build & Run

```powershell
# Build Docker image
docker build -t portfolio .

# Run container
docker run -p 3000:3000 portfolio

# Run with compose
docker-compose up

# Stop containers
docker-compose down

# View logs
docker logs container-id
```

---

## 🧪 Testing & Quality

### Run Tests

```powershell
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Type check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

---

## 📊 Performance

### Check Performance

```powershell
# Analyze bundle
npm run analyze

# Run build
npm run build

# Start server
npm run start

# Lighthouse audit (localhost:3000 must be running)
npx lighthouse http://localhost:3000
```

---

## 🔗 File Locations

| Task | File | Location |
|------|------|----------|
| Add route | Create file | `app/route-name/page.tsx` |
| Add component | Create file | `components/component-name.tsx` |
| Add style | Create/edit | `styles/globals.css` or `component-name.module.css` |
| Add API | Create file | `app/api/endpoint/route.ts` |
| Global config | Edit | `lib/config.ts` or `next.config.js` |
| SEO | Edit | `lib/seo.ts` |
| Types | Create | `types/index.ts` |
| Utilities | Create | `lib/utils.ts` |

---

## 🚀 Full Deployment Workflow

```powershell
# 1. Make changes
# (edit files in VS Code)

# 2. Type check locally
npm run type-check

# 3. Lint code
npm run lint

# 4. Test build
npm run build

# 5. Test production build
npm run start
# Visit http://localhost:3000

# 6. Commit changes
git add .
git commit -m "Add new feature"

# 7. Push to GitHub
git push

# 8. GitHub Actions runs automatically:
#    ✓ Runs tests (npm run type-check, npm run lint)
#    ✓ Builds (npm run build)
#    ✓ Deploys to Vercel/Netlify (if main branch)

# 9. Visit your live URL to verify
```

---

## 📞 Troubleshooting

### Port 3000 Already in Use
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <process-id> /F

# Or use different port
npm run dev -- -p 3001
```

### Node Modules Issues
```powershell
# Clean reinstall
rm -r node_modules package-lock.json
npm install
npm run build
```

### Build Fails
```powershell
# 1. Check for TypeScript errors
npm run type-check

# 2. Check linting
npm run lint

# 3. Try local build
npm run build

# 4. Check .env.local exists
# (contains all required variables)
```

### Git Issues
```powershell
# See what's different
git diff

# See staging area
git diff --cached

# Reset everything to last commit
git reset --hard HEAD
```

---

## 💡 Best Practices

1. **Always commit before pushing**
   ```powershell
   git add .
   git commit -m "Clear message"
   git push
   ```

2. **Test locally before pushing**
   ```powershell
   npm run type-check
   npm run lint
   npm run build
   npm run start
   ```

3. **Use meaningful commit messages**
   ```
   ✅ "Add contact form validation"
   ❌ "fix stuff"
   ```

4. **Keep .env.local out of Git**
   - Add to `.gitignore` ✓
   - Add vars to platform's Environment Variables section

5. **Update packages regularly**
   ```powershell
   npm update
   npm audit fix
   ```

---

## 📚 Quick Links

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **TypeScript**: https://typescriptlang.org
- **Tailwind CSS**: https://tailwindcss.com
- **ESLint**: https://eslint.org
- **Git Docs**: https://git-scm.com/doc

---

**Bookmark this page for quick reference!** 📌
