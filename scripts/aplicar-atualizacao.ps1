# scripts/aplicar-atualizacao.ps1
# Use antes de validar esta versão no projeto local.
# Remove leftovers de versões anteriores que podem quebrar o build.

$ErrorActionPreference = "Stop"
Write-Host "Limpando leftovers antigos..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .next,node_modules,src -ErrorAction SilentlyContinue
Remove-Item postcss.config.mjs,postcss.config.js,postcss.config.cjs,tailwind.config.ts,tailwind.config.js,tailwind.config.mjs,tailwind.config.cjs -Force -ErrorAction SilentlyContinue
Write-Host "Instalando dependencias..." -ForegroundColor Cyan
npm install
Write-Host "Validando..." -ForegroundColor Cyan
npm run check
