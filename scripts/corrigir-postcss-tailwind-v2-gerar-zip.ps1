# corrigir-postcss-tailwind-v2-gerar-zip.ps1
# Execute na raiz do projeto presenca-querida:
# powershell -ExecutionPolicy Bypass -File .\corrigir-postcss-tailwind-v2-gerar-zip.ps1

$ErrorActionPreference = "Stop"

Write-Host "== Presenca Querida | Correcao PostCSS/Tailwind v2 ==" -ForegroundColor Cyan

$projectRoot = (Get-Location).Path
Write-Host "Projeto: $projectRoot"

if (-not (Test-Path "package.json")) {
  throw "package.json nao encontrado. Execute este script na raiz do projeto presenca-querida."
}

# 1) Instala/garante dependencias exigidas pelo PostCSS/Tailwind v4
Write-Host "Instalando/confirmando dependencias..." -ForegroundColor Yellow
npm install -D tailwindcss @tailwindcss/postcss postcss

if ($LASTEXITCODE -ne 0) {
  throw "npm install falhou."
}

# 2) Corrige/cria postcss.config.mjs
Write-Host "Corrigindo postcss.config.mjs..." -ForegroundColor Yellow

$postcssContent = @'
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
'@

Set-Content -Path (Join-Path $projectRoot "postcss.config.mjs") -Value $postcssContent -Encoding UTF8

# 3) Ajusta globals.css em app/ ou src/app/
# Obs.: no PowerShell 5.1, nao usar virgula diretamente apos Join-Path.
$globalsCandidates = @()
$globalsCandidates += (Join-Path $projectRoot "app\globals.css")
$globalsCandidates += (Join-Path $projectRoot "src\app\globals.css")

foreach ($globalsPath in $globalsCandidates) {
  if (Test-Path $globalsPath) {
    Write-Host "Verificando CSS: $globalsPath" -ForegroundColor Yellow

    $css = Get-Content $globalsPath -Raw

    $hasImport = $css -match '@import\s+["'']tailwindcss["'']'
    $hasOldBase = $css -match '@tailwind\s+base;'
    $hasOldComponents = $css -match '@tailwind\s+components;'
    $hasOldUtilities = $css -match '@tailwind\s+utilities;'

    if ($hasOldBase -or $hasOldComponents -or $hasOldUtilities) {
      Write-Host "Convertendo diretivas antigas @tailwind para @import tailwindcss." -ForegroundColor Yellow

      $css = $css -replace '@tailwind\s+base;\s*', ''
      $css = $css -replace '@tailwind\s+components;\s*', ''
      $css = $css -replace '@tailwind\s+utilities;\s*', ''
      $css = $css.TrimStart()

      if ($css.StartsWith('@import "tailwindcss";') -eq $false) {
        $css = '@import "tailwindcss";' + "`r`n" + $css
      }

      Set-Content -Path $globalsPath -Value $css -Encoding UTF8
    }
    elseif (-not $hasImport) {
      Write-Host "Adicionando @import tailwindcss no topo do CSS." -ForegroundColor Yellow
      $css = '@import "tailwindcss";' + "`r`n" + $css
      Set-Content -Path $globalsPath -Value $css -Encoding UTF8
    }
    else {
      Write-Host "globals.css ja possui import do Tailwind." -ForegroundColor Green
    }
  }
}

# 4) Remove cache de build
Write-Host "Removendo cache .next..." -ForegroundColor Yellow
Remove-Item -Recurse -Force (Join-Path $projectRoot ".next") -ErrorAction SilentlyContinue

# 5) Roda validacao
Write-Host "Rodando npm run check..." -ForegroundColor Yellow
npm run check

if ($LASTEXITCODE -ne 0) {
  throw "npm run check falhou. Veja o erro acima."
}

# 6) Gera ZIP limpo
$zipName = "presenca-querida-daniela50-corrigido-postcss-v2.zip"
$zipPath = Join-Path $projectRoot $zipName

Write-Host "Gerando ZIP limpo: $zipPath" -ForegroundColor Yellow
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

$ignoreNames = @(
  "node_modules",
  ".next",
  ".git",
  $zipName
)

$items = Get-ChildItem -Force $projectRoot | Where-Object {
  $ignoreNames -notcontains $_.Name -and
  $_.Name -notlike "presenca-querida-daniela50-corrigido*.zip"
}

Compress-Archive -Path $items.FullName -DestinationPath $zipPath -Force

Write-Host ""
Write-Host "Pronto!" -ForegroundColor Green
Write-Host "ZIP gerado em: $zipPath" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos comandos sugeridos:" -ForegroundColor Cyan
Write-Host "git add ."
Write-Host "git commit -m `"Corrige PostCSS Tailwind para build`""
Write-Host "git push"
