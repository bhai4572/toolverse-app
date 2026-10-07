$today = (Get-Date).ToString("yyyy-MM-dd")
$base = "https://toolverse.baby"
$urls = [System.Collections.Generic.List[string]]::new()

function Add-Url($path, $freq, $prio) {
    $script:urls.Add("  <url>`n    <loc>$base$path</loc>`n    <lastmod>$today</lastmod>`n    <changefreq>$freq</changefreq>`n    <priority>$prio</priority>`n  </url>")
}

# 1. Homepage
Add-Url "" "daily" "1.0"

# 2. Categories
$registryText = Get-Content -Raw "lib/tools/registry.ts"
$catStart = $registryText.IndexOf("export const CATEGORIES")
$toolsStart = $registryText.IndexOf("export const TOOLS")
$catBlock = $registryText.Substring($catStart, $toolsStart - $catStart)
$catSlugs = [regex]::Matches($catBlock, "slug:\s*'([^']+)'") | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique

foreach ($c in $catSlugs) {
    Add-Url "/category/$c" "weekly" "0.8"
}

# 3. Live Tools
$toolsBlock = $registryText.Substring($toolsStart)
$toolBlocks = [regex]::Split($toolsBlock, "(?:\r?\n)\s*\{")
$liveTools = [System.Collections.Generic.List[string]]::new()

foreach ($b in $toolBlocks) {
    if ($b -match "slug:\s*'([^']+)'") {
        $toolSlug = $matches[1]
        if ($b -match "status:\s*'live'") {
            $liveTools.Add($toolSlug)
            Add-Url "/tools/$toolSlug" "weekly" "0.7"
        }
    }
}

# 4. Blog hub & Guides
Add-Url "/blog" "daily" "0.8"

$pillarByTool = @{
    'compress-image-target-size' = 'how-to-compress-image-to-target-size-under-50kb'
    'pdf-merge' = 'how-to-merge-pdf-files-privately-without-uploading'
    'heic-to-jpg' = 'convert-heic-to-jpg-windows-iphone'
    'barcode-generator' = 'how-to-generate-barcodes-free-code-128-ean-upc'
    'pakistan-salary-tax-estimator' = 'pakistan-salary-tax-calculator-slabs-guide'
    'utm-builder' = 'how-to-build-utm-campaign-urls'
    'global-job-finder' = 'top-high-paying-remote-jobs-worldwide'
}

$allBlogSlugs = [System.Collections.Generic.List[string]]::new()

$postsText = Get-Content -Raw "lib/blog/posts.ts"
$pillarMatches = [regex]::Matches($postsText, "slug:\s*'([a-z0-9-]+)'")
foreach ($m in $pillarMatches) {
    $val = $m.Groups[1].Value
    if ($val -and -not $allBlogSlugs.Contains($val)) {
        $allBlogSlugs.Add($val)
    }
}

foreach ($t in $liveTools) {
    $guideSlug = if ($pillarByTool.ContainsKey($t)) { $pillarByTool[$t] } else { "how-to-$t" }
    if (-not $allBlogSlugs.Contains($guideSlug)) {
        $allBlogSlugs.Add($guideSlug)
    }
}

foreach ($b in $allBlogSlugs) {
    Add-Url "/blog/$b" "weekly" "0.75"
}

# 5. Jobs
$jobLandings = @('remote-jobs', 'usa-jobs', 'software-engineer-jobs', 'data-entry-jobs', 'pakistan-govt-jobs')
foreach ($j in $jobLandings) {
    Add-Url "/jobs/$j" "daily" "0.8"
}

# 6. Legal pages
$legals = @('privacy-policy', 'terms-of-use', 'disclaimer', 'cookie-policy', 'dmca', 'about', 'contact', 'editorial-policy', 'security')
foreach ($l in $legals) {
    Add-Url "/legal/$l" "monthly" "0.5"
}

$xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>' + "`n" + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
$xmlFooter = '</urlset>'
$finalXml = $xmlHeader + "`n" + ($urls -join "`n") + "`n" + $xmlFooter

[System.IO.File]::WriteAllText("public/sitemap.xml", $finalXml, [System.Text.Encoding]::UTF8)
Write-Output "Successfully generated sitemap with $($urls.Count) URLs ($($liveTools.Count) live tools and $($allBlogSlugs.Count) blog guides)!"
