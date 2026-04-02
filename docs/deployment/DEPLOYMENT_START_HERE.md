# 🚀 Portfolio Deployment Guide - Complete Setup

**Last Updated:** March 29, 2026

## Table of Contents
1. [Quick Start (5 min)](#quick-start)
2. [GitHub Setup](#github-setup)
3. [Environment Configuration](#environment-configuration)
4. [Deployment Platforms](#deployment-platforms)
5. [Pre-Deployment Checklist](#pre-deployment-checklist)
6. [Verification & Testing](#verification--testing)

---

## Quick Start

**Choose your platform and follow the steps:**

- **Vercel** (Recommended - Optimized for Next.js) → [Jump to Vercel](#deploy-to-vercel)
- **Netlify** (Alternative) → [Jump to Netlify](#deploy-to-netlify)
- **Self-Hosted** (Advanced) → [Jump to Self-Hosted](#deploy-to-self-hosted-vps)

---

## GitHub Setup

### 1. Clone Your Repository
```powershell
# Clone the portfolio
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio

# Or use SSH (if you have SSH keys configured)
git clone git@github.com:YOUR_USERNAME/portfolio.git
cd portfolio
```

### 2. Verify Repository Structure
```powershell
# Check essential files exist
Test-Path "package.json"      # Should be $True
Test-Path "next.config.js"    # Should be $True
Test-Path "tsconfig.json"     # Should be $True
Test-Path ".env.local"        # Should be $True (or create from .env.example)
```

### 3. Install Dependencies
```powershell
npm ci        # Clean install (recommended for deployment)
# OR
npm install   # Regular install
```

### 4. Verify Local Build
```powershell
npm run build
npm run start
# Visit http://localhost:3000
```

---

## Environment Configuration

### Create `.env.local` File
```bash
# Application URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Security (generate with: openssl rand -hex 32)
JWT_SECRET=your_generated_secret_here

# Optional: Analytics & Monitoring
NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX          # Google Analytics
SENTRY_AUTH_TOKEN=your_sentry_token     # Error tracking (optional)

# Optional: Email Service
RESEND_API_KEY=your_resend_api_key      # Contact form emails

# Optional: Image Optimization
NEXT_PUBLIC_IMAGE_DOMAIN=images.example.com
```

**⚠️ IMPORTANT:** Never commit `.env.local` to GitHub!

### Generate Secure Secrets
```powershell
# Windows PowerShell - Generate JWT Secret
$secret = [System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
Write-Host $secret
```

---

## Deployment Platforms

### Deploy to Vercel

**Why Vercel?** Official Next.js hosting platform, zero-config deployment, automatic optimizations.

#### Step 1: Connect GitHub
1. Visit https://vercel.com
2. Click **"Add New" → "Project"**
3. Import GitHub repository
4. Select your portfolio repo

#### Step 2: Configure Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:
- `NEXT_PUBLIC_APP_URL`: `https://your-portfolio.vercel.app` (or custom domain)
- `NEXT_PUBLIC_API_URL`: Your API endpoint
- `JWT_SECRET`: Your generated secret
- Any other secrets from `.env.local`

#### Step 3: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Vercel provides automatic URL: `https://your-portfolio.vercel.app`

#### Step 4: Add Custom Domain (Optional)
1. In Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records (Vercel provides instructions)
4. Wait for SSL certificate (usually instant)

**Test:** Visit https://your-portfolio.vercel.app

---

### Deploy to Netlify

**Why Netlify?** Alternative platform, flexible deployment options, good free tier.

#### Step 1: Connect GitHub
1. Visit https://netlify.com
2. Click **"Add new site" → "Import an existing project"**
3. Select GitHub
4. Choose your portfolio repo

#### Step 2: Configure Build Settings
- **Build Command:** `npm ci && npm run build`
- **Publish Directory:** `.next`
- **Node Version:** `20.x` or higher

#### Step 3: Set Environment Variables
In Netlify Dashboard → Site Settings → Build & Deploy → Environment:
```
NEXT_PUBLIC_APP_URL=https://your-portfolio.netlify.app
NEXT_PUBLIC_API_URL=https://api.your-domain.com
JWT_SECRET=your_generated_secret
```

#### Step 4: Deploy
1. Click **"Save & Deploy"**
2. Wait for build completion
3. Netlify provides URL: `https://your-portfolio.netlify.app`

#### Step 5: Add Custom Domain (Optional)
1. Site Settings → Domain Management → Add custom domain
2. Update DNS records
3. Netlify handles SSL

**Test:** Visit https://your-portfolio.netlify.app

---

### Deploy to Self-Hosted VPS

**Why Self-Hosted?** Full control, custom configurations, own hardware.

#### Prerequisites
- VPS (Linode, DigitalOcean, AWS EC2, etc.)
- Ubuntu/Debian OS
- SSH access to server
- Domain name with DNS access

#### Step 1: Server Setup
```bash
# SSH into your server
ssh username@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Create deployment directory
sudo mkdir -p /var/www/portfolio
sudo chown $USER:$USER /var/www/portfolio
```

#### Step 2: Clone Repository
```bash
cd /var/www/portfolio
git clone https://github.com/YOUR_USERNAME/portfolio.git .
npm ci
```

#### Step 3: Create Environment File
```bash
# Create .env.production
nano .env.production

# Paste your environment variables:
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
JWT_SECRET=your_generated_secret
```

#### Step 4: Build & Start
```bash
npm run build

# Start with PM2
pm2 start "npm start" --name portfolio

# Save PM2 config
pm2 startup
pm2 save
```

#### Step 5: Setup Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/portfolio
```

Paste configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and start:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: Setup SSL (Free with Let's Encrypt)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

**Test:** Visit https://your-domain.com

---

## Pre-Deployment Checklist

- [ ] All environment variables defined in `.env.local`
- [ ] `.env.local` added to `.gitignore` (never commit secrets!)
- [ ] Local build succeeds: `npm run build`
- [ ] Local start works: `npm run start`
- [ ] TypeScript checks pass: `npx tsc --noEmit`
- [ ] No ESLint errors: `npm run lint`
- [ ] Database migrations run (if applicable)
- [ ] All dependencies listed in `package.json`
- [ ] `node_modules/` is in `.gitignore`
- [ ] Latest Git changes pushed to GitHub
- [ ] Custom domain DNS records configured (if using custom domain)
- [ ] Contact form endpoints tested
- [ ] API endpoints accessible from deployment platform
- [ ] Performance checked with Lighthouse
- [ ] Mobile responsiveness verified

---

## Verification & Testing

### After Deployment

#### 1. Test Basic Functionality
```powershell
# Visit your deployed site
# Check:
- [ ] Homepage loads (< 2 seconds)
- [ ] Navigation works
- [ ] About page loads
- [ ] Contact form displays
- [ ] Images load correctly
- [ ] No console errors (F12 → Console)
```

#### 2. Test Performance
```powershell
# Use Google PageSpeed Insights
https://pagespeed.web.dev/
# Enter: https://your-domain.com
# Check:
- [ ] Lighthouse score > 90
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
```

#### 3. Test SEO
```powershell
# Check meta tags (F12 → Elements)
- [ ] Title tag correct
- [ ] Meta description present
- [ ] OG image displays properly
- [ ] Structured data valid

# Validate with:
https://search.google.com/test/rich-results
```

#### 4. Test Security
```powershell
# Check:
- [ ] HTTPS enforced
- [ ] Security headers present (F12 → Network)
- [ ] No mixed content warnings
- [ ] .env variables not exposed

# Test with:
https://www.security-headers.com
```

#### 5. Monitor Errors
```powershell
# Setup error tracking (optional)
# Visit Sentry.io for real-time error monitoring

# Check deployment logs:
# Vercel: Dashboard → Deployments → Logs
# Netlify: Dashboard → Deploys → Logs
```

---

## Troubleshooting

### Build Fails
```powershell
# Clear cache and rebuild
npm ci
npm run build

# Check build output:
npm run build 2>&1 > build-log.txt
```

### Deployment Hangs
- Check Node version matches: `node --version` (should be 18+)
- Verify internet connection
- Check GitHub credentials / SSH keys
- Review deployment logs on platform dashboard

### Environment Variables Not Working
- Verify variables set in deployment platform dashboard
- Restart deployment after changing variables
- Check `.env.local` not committed to GitHub
- Verify variable names match in code

### Performance Issues
- Run `npm run build` locally and check bundle size
- Enable image optimization in `next.config.js`
- Use dynamic imports for large components
- Check Core Web Vitals in PageSpeed Insights

---

## Next Steps

1. ✅ **Deploy** to Vercel, Netlify, or VPS
2. 📊 **Monitor** with Google Analytics, Sentry
3. 📈 **Optimize** based on PageSpeed Insights
4. 🔄 **Setup CI/CD** for automatic deployments
5. 📧 **Configure email** for contact form
6. 🔐 **Enable security features** (CORS, rate limiting)

---

## Quick Reference

| Task | Command |
|------|---------|
| Local development | `npm run dev` |
| Build for production | `npm run build` |
| Test production build | `npm run start` |
| Type check | `npx tsc --noEmit` |
| Lint code | `npm run lint` |
| Format code | `npm run format` |

---

## Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Deployment:** https://vercel.com/docs
- **Netlify Deployment:** https://docs.netlify.com
- **Environment Variables:** [See ENV_SETUP.md](./ENV_SETUP.md)
- **GitHub Setup:** [See GITHUB_SETUP.md](./GITHUB_SETUP.md)
- **Performance Guide:** [See PERFORMANCE_TESTING.md](./PERFORMANCE_TESTING.md)

---

**Questions?** Check the platform-specific documentation or review the deployment logs.
