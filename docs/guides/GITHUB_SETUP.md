# GitHub Setup & Repository Configuration

## Step 1: Create GitHub Repository

### Option A: New Repository on GitHub
1. Visit https://github.com/new
2. **Repository name:** `portfolio` (or your preferred name)
3. **Description:** "Personal portfolio website - Next.js, React, TypeScript"
4. **Public or Private:** Choose based on preference
5. **Skip initialization** (you'll push existing code)
6. Click **"Create repository"**

### Option B: Push Existing Local Repository
If you already have the project locally:
```bash
# Navigate to your project
cd portfolio

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Portfolio setup"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Configure Repository

### Add .gitignore for Node.js/Next.js
Create `.gitignore` (if not exists):
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Environment variables (NEVER commit secrets!)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build
dist/
build/

# Cache
.cache/
.turbo/
```

### Commit and Push
```bash
git add .gitignore
git commit -m "Add gitignore for Node.js/Next.js"
git push origin main
```

---

## Step 3: GitHub Security Setup

### 1. Protect Main Branch
1. Go to Repository → **Settings** → **Branches**
2. Click **"Add rule"**
3. Apply to: `main`
4. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

### 2. Configure Secrets for Deployment
In Repository → **Settings** → **Secrets and variables** → **Actions**:

**For Vercel Deployment:**
```
VERCEL_TOKEN=your_vercel_token        # Get from https://vercel.com/account/tokens
VERCEL_ORG_ID=your_org_id             # Your Vercel organization ID
VERCEL_PROJECT_ID=your_project_id     # Your Vercel project ID
```

**For Netlify Deployment:**
```
NETLIFY_AUTH_TOKEN=your_netlify_token         # Get from https://app.netlify.com/user/applications/personal
NETLIFY_SITE_ID=your_netlify_site_id         # Your Netlify site ID
```

---

## Step 4: Create GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npx tsc --noEmit
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
```

**Push this file:**
```bash
mkdir -p .github/workflows
# Save the YAML above to .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions CI/CD pipeline"
git push origin main
```

---

## Step 5: Repository File Structure

Your repo should have this structure:
```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .gitignore
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   └── ...
├── components/
├── public/
├── styles/
├── .env.example              # Template (no secrets!)
├── .env.local               # Local only (in .gitignore)
├── package.json
├── tsconfig.json
├── next.config.js
├── vercel.json
├── eslint.config.mjs
├── README.md
├── DEPLOYMENT_START_HERE.md
└── ...
```

---

## Step 6: Create .env.example

Create `.env.example` (commit this, not .env.local):
```bash
# Application URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Security (generate with: openssl rand -hex 32)
JWT_SECRET=your_generated_secret_here_32_chars

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX

# Optional: Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
```

**Commit:**
```bash
git add .env.example
git commit -m "Add environment variables template"
git push origin main
```

---

## Step 7: Repository Documentation

### Update README.md
```markdown
# 🚀 My Portfolio

Personal portfolio website built with Next.js, React, and TypeScript.

## 🎯 Features
- Modern, responsive design
- Fast performance (Lighthouse 90+)
- Dark mode support
- SEO optimized
- Contact form

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
npm ci
\`\`\`

### Development
\`\`\`bash
npm run dev
# Visit http://localhost:3000
\`\`\`

### Production Build
\`\`\`bash
npm run build
npm run start
\`\`\`

## 📋 Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:
\`\`\`bash
cp .env.example .env.local
\`\`\`

## 🌐 Deployment
See [DEPLOYMENT_START_HERE.md](./DEPLOYMENT_START_HERE.md) for detailed deployment instructions.

## 📊 Performance
- Lighthouse Score: 95+
- First Contentful Paint: < 1.2s
- Largest Contentful Paint: < 2.0s

## 🔒 Security
- HTTPS enforced
- Security headers configured
- Environment variables protected
- No sensitive data in code

## 📝 License
MIT License - see LICENSE file

## 👤 Author
Your Name - [GitHub](https://github.com/YOUR_USERNAME) | [LinkedIn](https://linkedin.com/in/yourprofile)
```

---

## Step 8: Code Collaboration (Optional)

### Setup Local Development Branch
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# ... edit files ...

# Commit changes
git add .
git commit -m "Add your feature description"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Then merge after review
```

---

## Step 9: Useful GitHub Commands

```bash
# View branch history
git log --oneline

# View remote branches
git branch -a

# Pull latest changes
git pull origin main

# Revert last commit (before push)
git reset --soft HEAD~1

# View current status
git status

# View changes
git diff

# Create new branch from current
git checkout -b new-branch-name

# Delete branch locally
git branch -d branch-name

# Delete branch from GitHub
git push origin --delete branch-name
```

---

## Step 10: Enable GitHub Pages (Optional Static Hosting)

If you want to host on GitHub Pages:
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, folder: /root
4. Site will be available at: https://YOUR_USERNAME.github.io/portfolio

---

## Troubleshooting

### "Permission denied (publickey)"
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to SSH agent
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub: Settings → SSH Keys
cat ~/.ssh/id_ed25519.pub
```

### "Repository not found"
- Verify repository name is correct
- Check you have access to the repository
- Confirm username is correct

### "Commits not appearing"
```bash
# Check git config
git config user.name
git config user.email

# Set if not configured
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

---

## What's Next?

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Configure deployment secrets
4. ✅ Setup CI/CD pipeline
5. 📋 Run through [DEPLOYMENT_START_HERE.md](./DEPLOYMENT_START_HERE.md)
6. 🚀 Deploy to Vercel/Netlify/VPS
