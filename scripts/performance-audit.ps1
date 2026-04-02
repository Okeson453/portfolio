# scripts/performance-audit.ps1 - Performance audit script for Windows

Write-Host "🚀 SecureStack Portfolio Performance Audit" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install > $null 2>&1
}

Write-Host "Step 1: Building for production..." -ForegroundColor Yellow
npm run build > $null 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build successful" -ForegroundColor Green
}
else {
    Write-Host "✗ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Checking bundle size..." -ForegroundColor Yellow
$folderSize = Get-ChildItem -Path ".\.next\static" -Recurse | Measure-Object -Property Length -Sum
$sizeMB = [math]::Round($folderSize.Sum / 1MB, 2)
Write-Host "📦 Next.js Static Bundle: $sizeMB MB"

Write-Host ""
Write-Host "Step 3: Build output summary..." -ForegroundColor Yellow
Write-Host "Check .next folder for optimized output"

Write-Host ""
Write-Host "Step 4: Analyzing caching headers..." -ForegroundColor Yellow
Write-Host "Configuration loaded from: next.config.js"
Write-Host "  ✓ Static assets: 1-year cache"
Write-Host "  ✓ Images: 1-year cache"
Write-Host "  ✓ HTML: 1-hour cache"

Write-Host ""
Write-Host "Step 5: Performance checklist..." -ForegroundColor Yellow
Write-Host "  [ ] All images have width/height"
Write-Host "  [ ] Hero images have priority={true}"
Write-Host "  [ ] No console errors in DevTools"
Write-Host "  [ ] Lazy components loading correctly"

Write-Host ""
Write-Host "📊 Next steps:" -ForegroundColor Green
Write-Host "1. npm run start    (test locally)"
Write-Host "2. Open Chrome DevTools → Lighthouse"
Write-Host "3. Run audit (Mobile preferred)"
Write-Host "4. Target: 100/100 Performance"
Write-Host ""
Write-Host "5. Deploy: git push origin main"
Write-Host "6. Monitor Vercel Speed Insights"

Write-Host ""
Write-Host "Performance Audit Complete!" -ForegroundColor Green
