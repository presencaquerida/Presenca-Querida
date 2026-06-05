#!/usr/bin/env bash
set -euo pipefail
ROOT="$(pwd)"
OUT="$(dirname "$ROOT")/presenca-querida-atualizado-$(date +%Y%m%d-%H%M%S).zip"
TMP="/tmp/presenca-querida-atualizado-$(date +%Y%m%d-%H%M%S)"
rm -rf "$TMP"
mkdir -p "$TMP"
rsync -a --exclude node_modules --exclude .next --exclude .git --exclude .vercel --exclude src --exclude '*.zip' --exclude '.env*' "$ROOT/" "$TMP/"
(cd "$TMP" && zip -qr "$OUT" .)
rm -rf "$TMP"
echo "ZIP gerado: $OUT"
