#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_NAME="$(basename "$ROOT")"
DEST="$ROOT/../presenca-querida-daniela50.zip"
cd "$ROOT/.."
rm -f "$DEST"
zip -r "$DEST" "$PROJECT_NAME" \
  -x "*/node_modules/*" \
  -x "*/.next/*" \
  -x "*/.git/*" \
  -x "*/.vercel/*" \
  -x "*/.env.local" \
  -x "*/.env" \
  -x "*/presenca-querida-daniela50.zip"
echo "ZIP gerado em: $DEST"
