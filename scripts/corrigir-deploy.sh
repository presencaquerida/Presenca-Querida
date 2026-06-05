#!/usr/bin/env bash
set -euo pipefail

# Execute na raiz do projeto:
#   bash scripts/corrigir-deploy.sh

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Corrigindo layout para remover next/font Geist..."
if [[ -f "src/app/layout.tsx" ]]; then
  LAYOUT="src/app/layout.tsx"
elif [[ -f "app/layout.tsx" ]]; then
  LAYOUT="app/layout.tsx"
else
  echo "Nao encontrei src/app/layout.tsx nem app/layout.tsx" >&2
  exit 1
fi

cat > "$LAYOUT" <<'LAYOUTEOF'
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
LAYOUTEOF

echo "Garantindo scripts typecheck/check no package.json..."
node - <<'NODE'
const fs = require('fs');
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.typecheck = 'tsc --noEmit';
pkg.scripts.check = 'npm run lint && npm run typecheck && npm run build';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
NODE

echo "Gerando ZIP limpo..."
DEST="$ROOT/../presenca-querida-daniela50-corrigido.zip"
rm -f "$DEST"
cd "$ROOT/.."
zip -r "$DEST" "$(basename "$ROOT")" \
  -x "*/node_modules/*" \
  -x "*/.next/*" \
  -x "*/.git/*" \
  -x "*/.vercel/*" \
  -x "*/.env.local" \
  -x "*/.env" \
  -x "*/presenca-querida-daniela50*.zip"

echo "Concluido. ZIP gerado em: $DEST"
echo "Agora rode: npm install && npm run check"
