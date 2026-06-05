# scripts/gerar-zip.ps1
# Execute na raiz do projeto ou via: npm run zip

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$projectName = Split-Path $projectRoot -Leaf
$parent = Split-Path $projectRoot -Parent
$zipPath = Join-Path $parent "presenca-querida-daniela50-final.zip"

Write-Host "Gerando ZIP limpo do projeto: $projectRoot" -ForegroundColor Cyan

Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

$ignoreNames = @(
  "node_modules",
  ".next",
  ".git",
  "dist",
  "out",
  ".vercel"
)

$items = Get-ChildItem -Force $projectRoot | Where-Object {
  $ignoreNames -notcontains $_.Name -and
  $_.Name -notlike "*.zip"
}

$tempRoot = Join-Path $env:TEMP ("presenca-querida-zip-" + [guid]::NewGuid().ToString())
$tempProject = Join-Path $tempRoot $projectName
New-Item -ItemType Directory -Path $tempProject -Force | Out-Null

foreach ($item in $items) {
  Copy-Item $item.FullName -Destination $tempProject -Recurse -Force
}

Compress-Archive -Path $tempProject -DestinationPath $zipPath -Force
Remove-Item $tempRoot -Recurse -Force

Write-Host "ZIP gerado em: $zipPath" -ForegroundColor Green
