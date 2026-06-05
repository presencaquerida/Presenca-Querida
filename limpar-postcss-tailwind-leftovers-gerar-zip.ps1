# limpar-postcss-tailwind-leftovers-gerar-zip.ps1
# Execute na raiz do projeto presenca-querida:
# powershell -ExecutionPolicy Bypass -File .\limpar-postcss-tailwind-leftovers-gerar-zip.ps1

$ErrorActionPreference = "Stop"

Write-Host "== Presenca Querida | Limpeza de leftovers PostCSS/Tailwind ==" -ForegroundColor Cyan

$projectRoot = (Get-Location).Path
Write-Host "Projeto: $projectRoot"

if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
  throw "package.json nao encontrado. Execute este script na raiz do projeto presenca-querida."
}

# 1) Remove arquivos antigos que fazem o Next tentar carregar @tailwindcss/postcss
$filesToRemove = @()
$filesToRemove += "postcss.config.mjs"
$filesToRemove += "postcss.config.js"
$filesToRemove += "postcss.config.cjs"
$filesToRemove += "tailwind.config.ts"
$filesToRemove += "tailwind.config.js"
$filesToRemove += "tailwind.config.mjs"
$filesToRemove += "tailwind.config.cjs"

foreach ($fileName in $filesToRemove) {
  $path = Join-Path $projectRoot $fileName
  if (Test-Path $path) {
    Write-Host "Removendo leftover: $fileName" -ForegroundColor Yellow
    Remove-Item $path -Force
  }
}

# 2) Remove imports/diretivas Tailwind antigas do CSS, caso tenham ficado
$globalsCandidates = @()
$globalsCandidates += (Join-Path $projectRoot "app\globals.css")
$globalsCandidates += (Join-Path $projectRoot "src\app\globals.css")

foreach ($globalsPath in $globalsCandidates) {
  if (Test-Path $globalsPath) {
    Write-Host "Verificando CSS: $globalsPath" -ForegroundColor Yellow

    $css = Get-Content $globalsPath -Raw

    $originalCss = $css

    # Remove formas comuns de Tailwind v4/v3
    $css = $css -replace '@import\s+["'']tailwindcss["''];\s*', ''
    $css = $css -replace '@tailwind\s+base;\s*', ''
    $css = $css -replace '@tailwind\s+components;\s*', ''
    $css = $css -replace '@tailwind\s+utilities;\s*', ''

    if ($css -ne $originalCss) {
      Write-Host "Removidos imports/diretivas Tailwind de globals.css." -ForegroundColor Yellow
      Set-Content -Path $globalsPath -Value $css.TrimStart() -Encoding UTF8
    }
  }
}

# 3) Confirma que o package.json nao depende de Tailwind/PostCSS
Write-Host "Conferindo package.json..." -ForegroundColor Yellow
$pkgPath = Join-Path $projectRoot "package.json"
$pkg = Get-Content $pkgPath -Raw

if ($pkg -match '@tailwindcss/postcss|tailwindcss|postcss') {
  Write-Host "Aviso: package.json ainda menciona Tailwind/PostCSS. Vou manter como esta, mas o ideal e remover se o projeto usa CSS proprio." -ForegroundColor DarkYellow
}

# 4) Limpa caches
Write-Host "Removendo cache .next..." -ForegroundColor Yellow
Remove-Item -Recurse -Force (Join-Path $projectRoot ".next") -ErrorAction SilentlyContinue

# 5) Reinstala com base no package.json atual
Write-Host "Rodando npm install..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
  throw "npm install falhou."
}

# 6) Valida
Write-Host "Rodando npm run check..." -ForegroundColor Yellow
npm run check

if ($LASTEXITCODE -ne 0) {
  throw "npm run check falhou. Veja o erro acima."
}

# 7) Gera ZIP limpo
$zipName = "presenca-querida-daniela50-sem-tailwind-leftovers.zip"
$zipPath = Join-Path $projectRoot $zipName

Write-Host "Gerando ZIP limpo: $zipPath" -ForegroundColor Yellow
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

$ignoreNames = @()
$ignoreNames += "node_modules"
$ignoreNames += ".next"
$ignoreNames += ".git"
$ignoreNames += $zipName

$items = Get-ChildItem -Force $projectRoot | Where-Object {
  ($ignoreNames -notcontains $_.Name) -and
  ($_.Name -notlike "presenca-querida-daniela50*.zip")
}

Compress-Archive -Path $items.FullName -DestinationPath $zipPath -Force

Write-Host ""
Write-Host "Pronto!" -ForegroundColor Green
Write-Host "ZIP gerado em: $zipPath" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos comandos sugeridos:" -ForegroundColor Cyan
Write-Host "git add ."
Write-Host "git commit -m `"Remove leftovers de PostCSS Tailwind`""
Write-Host "git push"
