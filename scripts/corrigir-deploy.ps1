$ErrorActionPreference = "Stop"

# Execute este script na RAIZ do projeto presenca-querida:
#   powershell -ExecutionPolicy Bypass -File .\scripts\corrigir-deploy.ps1

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $Root

Write-Host "Corrigindo layout para remover next/font Geist..."
$LayoutCandidates = @(
  (Join-Path $Root "src\app\layout.tsx"),
  (Join-Path $Root "app\layout.tsx")
)
$LayoutPath = $LayoutCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $LayoutPath) {
  throw "Nao encontrei src\app\layout.tsx nem app\layout.tsx. Verifique se esta na raiz correta do projeto."
}

@'
import type { Metadata } from "next";
import "./globals.css";
import { BrandHeader } from "@/components/BrandHeader";

export const metadata: Metadata = {
  title: "Presença Querida",
  description: "Gestão afetiva de presenças para momentos importantes."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <BrandHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
'@ | Set-Content -Encoding UTF8 $LayoutPath

Write-Host "Garantindo scripts typecheck/check no package.json..."
$PackagePath = Join-Path $Root "package.json"
if (-not (Test-Path $PackagePath)) { throw "package.json nao encontrado." }
$Package = Get-Content $PackagePath -Raw | ConvertFrom-Json
if (-not $Package.scripts) {
  $Package | Add-Member -NotePropertyName scripts -NotePropertyValue ([pscustomobject]@{})
}
$Package.scripts | Add-Member -Force -NotePropertyName typecheck -NotePropertyValue "tsc --noEmit"
$Package.scripts | Add-Member -Force -NotePropertyName check -NotePropertyValue "npm run lint && npm run typecheck && npm run build"
$Package | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 $PackagePath

Write-Host "Gerando ZIP limpo..."
$Dest = Join-Path (Split-Path $Root -Parent) "presenca-querida-daniela50-corrigido.zip"
if (Test-Path $Dest) { Remove-Item $Dest -Force }
$Temp = Join-Path ([System.IO.Path]::GetTempPath()) ("presenca-querida-zip-" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $Temp | Out-Null
$ProjectCopy = Join-Path $Temp "presenca-querida"
Copy-Item $Root $ProjectCopy -Recurse
$RemoveDirs = @("node_modules", ".next", ".git", ".vercel")
foreach ($DirName in $RemoveDirs) {
  Get-ChildItem $ProjectCopy -Recurse -Force -Directory -Filter $DirName -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
}
Get-ChildItem $ProjectCopy -Recurse -Force -File -Include ".env.local", ".env" -ErrorAction SilentlyContinue | Remove-Item -Force
Compress-Archive -Path $ProjectCopy -DestinationPath $Dest
Remove-Item $Temp -Recurse -Force

Write-Host "Concluido. ZIP gerado em: $Dest"
Write-Host "Agora rode: npm install; npm run check"
