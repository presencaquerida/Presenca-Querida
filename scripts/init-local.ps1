$ErrorActionPreference = "Stop"
if (-not (Test-Path ".env.local")) {
  Copy-Item ".env.example" ".env.local"
  Write-Host "Arquivo .env.local criado. Edite com as chaves do Supabase quando quiser sair do modo demo."
}
npm install
npm run dev
