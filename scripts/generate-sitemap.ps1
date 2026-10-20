# Thin wrapper — canonical generator is generate-sitemap.mjs
node "$PSScriptRoot/generate-sitemap.mjs"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
