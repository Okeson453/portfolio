#!/bin/bash

# Enterprise SEO Implementation Validation Script
# Run this to verify all Phase 1-4 implementations are in place

set -e

echo "🔍 Enterprise SEO Implementation Validation Script"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test count
TESTS_PASSED=0
TESTS_FAILED=0

check_file() {
    local file=$1
    local description=$2
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description: $file"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗${NC} $description: $file (NOT FOUND)"
        ((TESTS_FAILED++))
    fi
}

check_pattern() {
    local file=$1
    local pattern=$2
    local description=$3
    if grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✓${NC} $description"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗${NC} $description (PATTERN NOT FOUND)"
        ((TESTS_FAILED++))
    fi
}

echo "PHASE 1: Technical SEO Foundation"
echo "─────────────────────────────────"
check_file "public/robots.txt" "robots.txt"
check_file "app/robots.ts" "robots.ts"
check_file "app/sitemap.ts" "sitemap.ts"
check_file "app/sitemap-blog.ts" "sitemap-blog.ts"
check_file "app/sitemap-projects.ts" "sitemap-projects.ts"
check_pattern "app/layout.tsx" "SchemaScript" "Layout uses SchemaScript"
check_pattern "app/layout.tsx" "colorScheme" "Layout includes color-scheme"
echo ""

echo "PHASE 2: Structured Data & Social Signals"
echo "──────────────────────────────────────────"
check_file "lib/schema.ts" "schema.ts library"
check_file "lib/og.ts" "og.ts helper"
check_file "app/api/og/route.tsx" "OG image generator"
check_pattern "lib/schema.ts" "generatePersonSchema" "Person schema generator"
check_pattern "lib/schema.ts" "generateArticleSchema" "Article schema generator"
check_pattern "lib/schema.ts" "SchemaScript" "Schema injection component"
check_pattern "lib/seo.ts" "twitterHandle" "Twitter handle in siteConfig"
echo ""

echo "PHASE 3: Authority & Content Strategy"
echo "──────────────────────────────────────"
check_file "components/About.tsx" "About component"
check_file "components/AuthorBio.tsx" "AuthorBio component"
check_file "lib/keywords.ts" "keywords strategy"
check_pattern "app/projects/page.tsx" "buildOGImageUrl" "Projects page enhanced"
check_pattern "app/blog/page.tsx" "generateBreadcrumbSchema" "Blog page enhanced"
check_pattern "components/About.tsx" "E-E-A-T" "About has authority signals"
echo ""

echo "PHASE 4: Analytics & Link Building"
echo "──────────────────────────────────"
check_file "lib/analytics.ts" "analytics tracking"
check_file "docs/SEO_IMPLEMENTATION_GUIDE.md" "SEO implementation guide"
check_pattern "lib/analytics.ts" "trackEvent" "Event tracking function"
check_pattern "lib/analytics.ts" "buildShareUrl" "Share URL builder"
check_pattern "lib/analytics.ts" "Search Console" "Search Console guidance"
echo ""

echo "=================================================="
echo "SUMMARY"
echo "─────────────────────────────────────────────────"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All validations passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run build"
    echo "2. Run: npx lighthouse https://okeson.dev --only-categories=seo"
    echo "3. Deploy to Vercel"
    echo "4. Complete POST-DEPLOYMENT_SETUP.md steps"
    exit 0
else
    echo -e "${RED}❌ Some validations failed!${NC}"
    echo "Please review the missing files/patterns above."
    exit 1
fi
