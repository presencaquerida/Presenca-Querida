# scripts/aplicar-atualizacao.ps1
# Use depois de substituir os arquivos no projeto local.
# Remove caches e sobras antigas sem apagar o postcss.config.mjs vazio usado para isolar configs externas.

$ErrorActionPreference = "Stop"

Write-Host "Limpando caches e leftovers antigos..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .next,node_modules,src -ErrorAction SilentlyContinue
Remove-Item tailwind.config.ts,tailwind.config.js,tailwind.config.mjs,tailwind.config.cjs -Force -ErrorAction SilentlyContinue

Write-Host "Garantindo postcss.config.mjs limpo..." -ForegroundColor Cyan
$postcss = @'
const config = {
  plugins: {},
};

export default config;
'@
Set-Content -Path "postcss.config.mjs" -Value $postcss -Encoding UTF8

Write-Host "Instalando dependencias..." -ForegroundColor Cyan
npm install

Write-Host "Validando..." -ForegroundColor Cyan
npm run check
