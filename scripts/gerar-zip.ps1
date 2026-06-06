# scripts/gerar-zip.ps1
# Execute na raiz do projeto:
# powershell -ExecutionPolicy Bypass -File .\scripts\gerar-zip.ps1

$ErrorActionPreference = "Stop"
$root = (Get-Location).Path
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipPath = Join-Path (Split-Path $root -Parent) "presenca-querida-atualizado-$timestamp.zip"
$tempDir = Join-Path $env:TEMP "presenca-querida-atualizado-$timestamp"

Write-Host "Gerando ZIP limpo do Presenca Querida..." -ForegroundColor Cyan

$ignoreNames = @(
  "node_modules", ".next", ".git", ".vercel", "out", "dist", "build", ".turbo", ".cache"
)
$ignoreFiles = @(".env", ".env.local", ".env.production", ".env.development", "tsconfig.tsbuildinfo")

Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tempDir | Out-Null

function Copy-Safe($source, $dest) {
  $name = Split-Path $source -Leaf
  if ($ignoreNames -contains $name) { return }
  if ($ignoreFiles -contains $name) { return }
  if ($name -like "*.zip") { return }
  if ($name -like "*.log") { return }

  if (Test-Path $source -PathType Container) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
    Get-ChildItem -Force $source | ForEach-Object { Copy-Safe $_.FullName (Join-Path $dest $_.Name) }
  } elseif (Test-Path $source -PathType Leaf) {
    $parent = Split-Path $dest -Parent
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    Copy-Item $source $dest -Force
  }
}

Get-ChildItem -Force $root | ForEach-Object { Copy-Safe $_.FullName (Join-Path $tempDir $_.Name) }

Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $zipPath -Force
Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue

Write-Host "ZIP gerado:" -ForegroundColor Green
Write-Host $zipPath -ForegroundColor Yellow
