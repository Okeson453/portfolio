# Deployment Quick Reference - Commands Cheatsheet

## Essential Commands

### Development
```bash
npm run dev           # Start dev server (http://localhost:3000)
npm run build         # Build for production
npm run start         # Start production build locally
npm run lint          # Run ESLint
npm run format        # Format code (Prettier)
npx tsc --noEmit      # TypeScript type check
```

### Git Operations
```bash
git status                          # Check uncommitted changes
git add .                           # Stage all changes
git commit -m "message"             # Commit changes
git push origin main                # Push to GitHub
git pull origin main                # Pull latest changes
git log --oneline                   # View commit history
git branch -a                       # View all branches
git checkout -b feature/name        # Create new branch
```

### Environment Setup
```bash
cp .env.example .env.local          # Create local env file
cat .env.local                      # View env variables
# Edit with your values
```

### Package Management
```bash
npm ci                              # Clean install (recommended)
npm install                         # Regular install
npm update                          # Update packages
npm audit                           # Check security vulnerabilities
npm audit fix                       # Fix security issues
npm list                            # View installed packages
```

---

## Deployment Platform Commands

### Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel                              # Deploy to staging
vercel --prod                       # Deploy to production

# View deployments
vercel list

# Logs
vercel logs https://your-domain.com

# Rollback
vercel rollback
```

### Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy                      # Deploy to staging
netlify deploy --prod               # Deploy to production

# Open dashboard
netlify open

# View logs
netlify logs
```

### Docker (Self-Hosted)
```bash
# Build image
docker build -t portfolio .

# Run container
docker run -p 3000:3000 portfolio

# Stop container
docker stop <container_id>

# Remove image
docker rmi portfolio
```

### PM2 (Self-Hosted Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start "npm start" --name portfolio

# View processes
pm2 list

# Restart
pm2 restart portfolio

# Stop
pm2 stop portfolio

# Delete
pm2 delete portfolio

# View logs
pm2 logs portfolio

# Make startup permanent
pm2 startup
pm2 save
```

---

## Troubleshooting Commands

### Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Clear Next.js build
rm -r .next

# Clear node_modules
rm -r node_modules
npm ci
```

### Check Environment
```bash
# Node version
node --version                      # Should be 18+

# npm version
npm --version

# Git status
git status

# Environment variables
echo $env:NEXT_PUBLIC_APP_URL        # PowerShell
echo $NEXT_PUBLIC_APP_URL            # Bash
```

### Test Build
```bash
# Full build test
npm ci
npm run build 2>&1 | head -50        # View first 50 lines of output

# Check build size
du -sh .next                         # macOS/Linux
Get-ChildItem .next -Recurse | Measure-Object -Sum Length | Select Sum
```

### Network & Port Check
```bash
# Check if port 3000 is available
lsof -i :3000                        # macOS/Linux
netstat -ano | findstr :3000         # Windows

# Test API connectivity
curl https://api.your-domain.com/health  # macOS/Linux
Invoke-WebRequest https://api.your-domain.com/health  # PowerShell
```

---

## Performance Testing

### Google PageSpeed Insights
```
https://pagespeed.web.dev/
# Enter your domain → View performance report
```

### Lighthouse CLI
```bash
# Install
npm install -g lighthouse

# Run audit
lighthouse https://your-domain.com --output=html

# With specific settings
lighthouse https://your-domain.com --chrome-flags="--headless=old"
```

### WebPageTest
```
https://www.webpagetest.org/
# Enter your domain → View detailed performance analysis
```

---

## Deployment Checklist (Quick)

```bash
# 1. Prepare code
npm ci && npm run build && npm run lint && npx tsc --noEmit

# 2. Test locally
npm run start
# Visit http://localhost:3000 and test thoroughly

# 3. Commit and push
git add .
git commit -m "Production release: version 1.0.0"
git push origin main

# 4. Deploy
# Vercel: vercel --prod
# Netlify: netlify deploy --prod
# Self-hosted: git pull && pm2 restart portfolio

# 5. Verify
# Visit production URL and verify all functionality
```

---

## Long Command Templates

### Complete Local Setup
```bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
cp .env.example .env.local
# Edit .env.local with your values
npm ci
npm run build
npm run start
# Visit http://localhost:3000
```

### Complete Vercel Deployment
```bash
npm install -g vercel
vercel logout
vercel login
vercel
# Follow prompts
vercel --prod
```

### Complete Self-Hosted Deployment
```bash
# On your VPS
ssh user@your-server.com

# Install everything
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2

# Clone and setup
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
sudo chown -R $USER:$USER .
npm ci

# Create environment
cat > .env.production << EOF
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
JWT_SECRET=your_secret_here
EOF

# Build and start
npm run build
pm2 start "npm start" --name portfolio
pm2 startup && pm2 save

# Setup Nginx
sudo bash << 'EOF'
cat > /etc/nginx/sites-available/portfolio << 'NGX'
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
NGX

ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
EOF

# Setup SSL
sudo certbot --nginx -d your-domain.com
sudo systemctl enable certbot.timer
```

---

## Environment Variables - Quick Reference

### Development (.env.local)
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
JWT_SECRET=dev_secret_for_testing_only
```

### Production (Platform Dashboard)
```
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
JWT_SECRET=your_production_32_char_hex_string
```

---

## File Structure for Reference
```
portfolio/
├── .github/workflows/
│   └── deploy.yml              # CI/CD pipeline
├── .gitignore                  # Git ignore rules
├── .env.example                # Template (commit this)
├── .env.local                  # Local secrets (in .gitignore, don't commit)
├── app/                        # Next.js app directory
├── components/                 # React components
├── public/                      # Static files
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.js              # Next.js config
├── vercel.json                 # Vercel deploy config
├── eslint.config.mjs           # ESLint config
├── README.md                   # Project readme
├── DEPLOYMENT_START_HERE.md    # Main deployment guide
├── DEPLOYMENT_CHECKLIST.md     # Pre-deployment checklist
├── DEPLOYMENT_COMMANDS.md      # This file (quick reference)
├── ENV_SETUP.md                # Environment variables guide
└── GITHUB_SETUP.md             # GitHub setup guide
```

---

## One-Line Commands

```bash
# Cleanup and rebuild
rm -rf node_modules .next package-lock.json && npm install && npm run build

# Deploy and test
npm run build && npm run start && open http://localhost:3000

# Check everything before deploy
npm ci && npm run lint && npx tsc --noEmit && npm run build

# View live logs (Vercel)
vercel logs --follow

# View live logs (Netlify)
netlify logs --follow

# Generate JWT secret (macOS/Linux)
openssl rand -hex 32

# Generate JWT secret (PowerShell)
$([Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)))
```

---

## Getting Help

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **TypeScript Docs:** https://www.typescriptlang.org/docs/
- **React Docs:** https://react.dev

---

**Related Guides:**
- [DEPLOYMENT_START_HERE.md](./DEPLOYMENT_START_HERE.md) - Full deployment guide
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables detailed guide
- [GITHUB_SETUP.md](./GITHUB_SETUP.md) - GitHub repository setup
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
