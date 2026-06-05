$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$Dest = Join-Path (Split-Path $Root -Parent) "presenca-querida-daniela50.zip"
if (Test-Path $Dest) { Remove-Item $Dest -Force }
$Temp = Join-Path ([System.IO.Path]::GetTempPath()) ("presenca-querida-zip-" + [guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $Temp | Out-Null
$ProjectCopy = Join-Path $Temp "presenca-querida"
Copy-Item $Root $ProjectCopy -Recurse
$RemovePatterns = @("node_modules", ".next", ".git", ".vercel")
foreach ($Pattern in $RemovePatterns) {
  Get-ChildItem $ProjectCopy -Recurse -Force -Directory -Filter $Pattern | Remove-Item -Recurse -Force
}
Get-ChildItem $ProjectCopy -Recurse -Force -File -Include ".env.local", ".env" | Remove-Item -Force
Compress-Archive -Path $ProjectCopy -DestinationPath $Dest
Remove-Item $Temp -Recurse -Force
Write-Host "ZIP gerado em: $Dest"
