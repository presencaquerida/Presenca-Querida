# gerar-zip-presenca-querida-ajustes-v3.ps1
# Execute na RAIZ do projeto:
# cd C:\Users\lacos\Documents\GitHub\presenca-querida
# powershell -ExecutionPolicy Bypass -File .\gerar-zip-presenca-querida-ajustes-v3.ps1

$ErrorActionPreference = "Stop"

Write-Host "== Presenca Querida | ZIP para ajustes v3 ==" -ForegroundColor Cyan

$root = (Get-Location).Path
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipName = "presenca-querida-ajustes-v3-$timestamp.zip"
$zipPath = Join-Path $root $zipName
$tempDir = Join-Path $env:TEMP "presenca-querida-ajustes-v3-$timestamp"

if (-not (Test-Path (Join-Path $root "package.json"))) {
  throw "package.json nao encontrado. Execute este script na raiz do projeto."
}

Write-Host "Projeto: $root"
Write-Host "ZIP: $zipPath"

$includeItems = @(
  "app",
  "src",
  "components",
  "lib",
  "public",
  "supabase",
  "scripts",
  "docs",
  "styles",
  "middleware.ts",
  "middleware.js",
  "next.config.js",
  "next.config.mjs",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next-env.d.ts",
  "README.md",
  ".env.example",
  "eslint.config.mjs",
  ".eslintrc.json",
  ".gitignore"
)

$excludeDirNames = @(
  "node_modules",
  ".next",
  ".git",
  ".vercel",
  "out",
  "dist",
  "build",
  ".turbo",
  ".cache",
  "coverage"
)

$excludeFileNames = @(
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  ".env.test"
)

$excludeExtensions = @(
  ".zip",
  ".log"
)

Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tempDir | Out-Null

function Copy-ItemSafe {
  param(
    [string]$Source,
    [string]$Destination
  )

  $name = Split-Path $Source -Leaf

  if ($excludeDirNames -contains $name) { return }
  if ($excludeFileNames -contains $name) { return }

  $ext = [System.IO.Path]::GetExtension($Source)
  if ($excludeExtensions -contains $ext) { return }

  if (Test-Path $Source -PathType Container) {
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    Get-ChildItem -Force $Source | ForEach-Object {
      Copy-ItemSafe -Source $_.FullName -Destination (Join-Path $Destination $_.Name)
    }
  }
  elseif (Test-Path $Source -PathType Leaf) {
    $parent = Split-Path $Destination -Parent
    if (-not (Test-Path $parent)) {
      New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
    Copy-Item -Path $Source -Destination $Destination -Force
  }
}

foreach ($item in $includeItems) {
  $source = Join-Path $root $item
  if (Test-Path $source) {
    Copy-ItemSafe -Source $source -Destination (Join-Path $tempDir $item)
  }
}

$reportPath = Join-Path $tempDir "RELATORIO_PARA_AJUSTES_V3.txt"
$report = @()
$report += "Presenca Querida - ZIP para ajustes v3"
$report += "Gerado em: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$report += "Origem: $root"
$report += ""
$report += "Itens para revisar na proxima rodada:"
$report += "- Header mobile sem opcao de Gestao na landing"
$report += "- Botao 'Cliente' renomeado para 'Ja e cliente'"
$report += "- Fluxo de login do cliente"
$report += "- Area cliente travando em 'Carregando'"
$report += "- CTA comercial e texto do proximo passo"
$report += "- Landing, planos e precificacao"
$report += "- Gestao acessivel apenas por login protegido"
$report += ""
$report += "Nao incluidos por seguranca:"
$report += "- .env / .env.local / .env.production"
$report += "- .vercel"
$report += "- node_modules"
$report += "- .next"
$report += "- .git"
$report += ""
$report += "Arquivos no ZIP:"
Get-ChildItem -Recurse -Force $tempDir | ForEach-Object {
  $relative = $_.FullName.Replace($tempDir, "").TrimStart("\")
  if ($relative -ne "") {
    $report += "- $relative"
  }
}
Set-Content -Path $reportPath -Value ($report -join "`r`n") -Encoding UTF8

Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $zipPath -Force
Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Pronto!" -ForegroundColor Green
Write-Host "Envie aqui este arquivo:" -ForegroundColor Green
Write-Host $zipPath -ForegroundColor Yellow
Write-Host ""
Write-Host "Conferencia recomendada antes de enviar:" -ForegroundColor Cyan
Write-Host "npm run check"
