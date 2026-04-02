#!/bin/bash
# scripts/performance-audit.sh - Quick performance audit script

echo "🚀 SecureStack Portfolio Performance Audit"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

echo "${YELLOW}Step 1: Building for production...${NC}"
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "${GREEN}✓ Build successful${NC}"
else
    echo "${RED}✗ Build failed${NC}"
    exit 1
fi

echo ""
echo "${YELLOW}Step 2: Checking bundle size...${NC}"
SIZE=$(du -sh .next/static | cut -f1)
echo "📦 Next.js Static Bundle: $SIZE"

echo ""
echo "${YELLOW}Step 3: Analyzing bundle composition...${NC}"
echo "Run this for detailed analysis:"
echo "${GREEN}ANALYZE=true npm run build${NC}"

echo ""
echo "${YELLOW}Step 4: Testing locally...${NC}"
echo "In another terminal, run:"
echo "${GREEN}npm run start${NC}"
echo "Then open Chrome DevTools → Lighthouse → Analyze page"

echo ""
echo "📊 Performance Tips:"
echo "   1. LCP (Largest Contentful Paint): Should be <2.5s"
echo "   2. FID (First Input Delay): Should be <100ms"
echo "   3. CLS (Cumulative Layout Shift): Should be <0.1"
echo "   4. Check images have width/height attributes"
echo "   5. Verify caching headers are applied"

echo ""
echo "${GREEN}Performance Audit Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Deploy to Vercel: git push origin main"
echo "2. Check Vercel Speed Insights dashboard"
echo "3. Monitor real-user Web Vitals"
echo "4. Aim for 100/100 Lighthouse score"
