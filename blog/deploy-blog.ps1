# deploy-blog.ps1 — Build Astro blog and copy to site root /blog (PowerShell)
# Run in PowerShell as Administrator if needed:  Right-click → "Run with PowerShell"

$src  = "C:\Users\Fabio ESTUDO\Desktop\Obsidian\3. Recursos (Materiais de suporte e interesse geral)\70 - 79 IA\71 - PAVIE Advocacia\Site\PAVIE-091025\blog\dist\blog"
$dest = "C:\Users\Fabio ESTUDO\Desktop\Obsidian\3. Recursos (Materiais de suporte e interesse geral)\70 - 79 IA\71 - PAVIE Advocacia\Site\PAVIE-091025\blog"

# Optional build step (uncomment if you want this script to build too):
# Push-Location "C:\Users\Fabio ESTUDO\Desktop\Obsidian\3. Recursos (Materiais de suporte e interesse geral)\70 - 79 IA\71 - PAVIE Advocacia\Site\PAVIE-091025\blog"
# npm install
# npx astro clean
# npm run build
# Pop-Location

if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Force -Path $dest | Out-Null }

# Clear destination (but keep the folder)
Get-ChildItem -Path $dest -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# Copy built files
Copy-Item -Path (Join-Path $src '*') -Destination $dest -Recurse -Force -ErrorAction Stop

Write-Host "`n✅ Copia concluída: $src -> $dest"
