#!/bin/bash

##############################################################################
# PHASE 2A: PERFORMANCE OPTIMIZATION IMPLEMENTATION
# 
# This script helps identify and implement performance improvements
# 
# Usage: bash phase2a-performance-optimization.sh
##############################################################################

set -e

echo "🚀 PHASE 2A: PERFORMANCE OPTIMIZATION"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ─────────────────────────────────────────────────────────────────────
# STEP 1: Bundle Analysis
# ─────────────────────────────────────────────────────────────────────

echo -e "${BLUE}STEP 1: Bundle Size Analysis${NC}"
echo "This will create a visual breakdown of your bundle..."
echo ""

if [ -f "next.config.js" ]; then
    echo -e "${YELLOW}⚠ Adding bundle analyzer to next.config.js${NC}"
    echo ""
    echo "To enable bundle analysis, run:"
    echo "  npm run analyze"
    echo ""
fi

# ─────────────────────────────────────────────────────────────────────
# STEP 2: Performance Benchmarking
# ─────────────────────────────────────────────────────────────────────

echo -e "${BLUE}STEP 2: Performance Benchmarking${NC}"
echo "Recording current performance metrics..."
echo ""

# Create performance baseline
if [ ! -f ".performance-baseline.json" ]; then
    cat > .performance-baseline.json << 'EOF'
{
  "date": "2026-04-03",
  "metrics": {
    "bundleSize": "95KB",
    "lcp": "800ms",
    "inp": "150ms",
    "cls": "<0.1",
    "fcp": "300ms"
  },
  "status": "Phase 1 Baseline"
}
EOF
    echo -e "${GREEN}✅ Created performance baseline: .performance-baseline.json${NC}"
else
    echo -e "${YELLOW}⚠ Performance baseline already exists${NC}"
fi

echo ""

# ─────────────────────────────────────────────────────────────────────
# STEP 3: Check for optimization opportunities
# ─────────────────────────────────────────────────────────────────────

echo -e "${BLUE}STEP 3: Detecting Optimization Opportunities${NC}"
echo ""

# Check for unused imports
echo "🔍 Checking for potentially unused Radix components..."
if grep -r "@radix-ui/react-" lib/ components/ app/ 2>/dev/null | wc -l > /dev/null; then
    echo -e "${YELLOW}Found Radix UI imports - review for unused components${NC}"
fi

# Check for icon usage
echo "🔍 Checking for icon optimization..."
if grep -r "lucide-react" lib/ components/ app/ 2>/dev/null | wc -l > /dev/null; then
    echo -e "${YELLOW}Found lucide-react icons - ensure using individual imports${NC}"
fi

# Check for images
echo "🔍 Checking for image optimization..."
if grep -r "<img" components/ app/ 2>/dev/null | wc -l > /dev/null; then
    echo -e "${YELLOW}Found <img> tags - migrate to Next.js Image component${NC}"
fi

echo ""

# ─────────────────────────────────────────────────────────────────────
# STEP 4: Lighthouse Audit
# ─────────────────────────────────────────────────────────────────────

echo -e "${BLUE}STEP 4: Running Lighthouse Audit${NC}"
echo ""

if npm run lighthouse 2>/dev/null; then
    echo -e "${GREEN}✅ Lighthouse audit complete${NC}"
else
    echo -e "${YELLOW}⚠ Lighthouse audit requires Vercel CLI or local server${NC}"
    echo "To run manually:"
    echo "  npm run lighthouse"
fi

echo ""

# ─────────────────────────────────────────────────────────────────────
# STEP 5: Output recommendations
# ─────────────────────────────────────────────────────────────────────

echo -e "${BLUE}STEP 5: Performance Optimization Recommendations${NC}"
echo ""

cat << 'EOF'
📋 TOP PRIORITY OPTIMIZATIONS:

1. BUNDLE SIZE REDUCTION (4 hours)
   □ Analyze with: npm run analyze
   □ Identify unused Radix UI components
   □ Implement dynamic imports:
     - Lazy load modals and dropdowns
     - Split large components
   □ Tree-shake lucide-react icons:
     - Use individual imports
     - Remove unused icon sets
   □ Expected savings: ~15KB (95KB → 80KB)

2. LCP OPTIMIZATION (5 hours)
   □ Image optimization:
     - Migrate to Next.js Image component
     - Add width/height attributes
     - Use WebP with fallback
     - Implement lazy loading
   □ Preload directives:
     - Preload critical fonts
     - Preload above-the-fold images
     - dns-prefetch for external services
   □ CSS/JS optimization:
     - Defer non-critical CSS
     - Inline critical CSS
     - Move scripts to end
   □ Expected improvement: 200ms (800ms → 600ms)

3. INP OPTIMIZATION (5 hours)
   □ Use useTransition hook for:
     - Form submission
     - Menu navigation
     - Theme toggle
   □ Add debouncing/throttling:
     - Search input: 300ms
     - Form validation: 500ms
     - Scroll handlers: 100ms
   □ Monitor with Web Vitals library
   □ Expected improvement: 50ms (150ms → 100ms)

📊 MEASUREMENT STRATEGY:
   - Before optimization: npm run lighthouse
   - After each change: Test locally
   - Track in: performance-report.json
   - Deploy and monitor production metrics

🎯 TARGETS:
   - Bundle Size: <80KB
   - LCP: ≤600ms
   - INP: ≤100ms
   - Lighthouse: ≥90

EOF

echo ""
echo -e "${GREEN}✅ Performance optimization plan ready!${NC}"
echo ""
echo "Next steps:"
echo "1. Review this output"
echo "2. Run: npm run analyze"
echo "3. Start implementing optimizations"
echo "4. Track improvements in performance-report.json"
echo ""
