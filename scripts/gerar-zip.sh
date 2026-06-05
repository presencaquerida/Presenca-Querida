#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PARENT_DIR="$(dirname "$PROJECT_ROOT")"
ZIP_PATH="$PARENT_DIR/presenca-querida-daniela50-final.zip"
PROJECT_NAME="$(basename "$PROJECT_ROOT")"
TMP_DIR="$(mktemp -d)"

rm -f "$ZIP_PATH"
rsync -a \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.vercel' \
  --exclude '*.zip' \
  "$PROJECT_ROOT/" "$TMP_DIR/$PROJECT_NAME/"

(cd "$TMP_DIR" && zip -r "$ZIP_PATH" "$PROJECT_NAME")
rm -rf "$TMP_DIR"
echo "ZIP gerado em: $ZIP_PATH"
