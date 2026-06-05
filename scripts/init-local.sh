#!/usr/bin/env bash
set -euo pipefail
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Arquivo .env.local criado. Edite com as chaves do Supabase quando quiser sair do modo demo."
fi
npm install
npm run dev
