# Correção de deploy — Presença Querida

## O que foi corrigido

1. Remoção do uso de `next/font` com `Geist` e `Geist Mono` no `layout.tsx`.
   - O projeto está usando Next.js 14.2.23.
   - Para evitar erro de build, o layout agora usa apenas CSS global.

2. Inclusão dos scripts:
   - `npm run typecheck`
   - `npm run check`

3. Substituição dos `<img>` principais por `next/image` para limpar os avisos do lint.

## Comandos recomendados

```powershell
npm install
npm run lint
npm run typecheck
npm run build
```

Ou tudo de uma vez:

```powershell
npm run check
```

## Script para corrigir e gerar ZIP no Windows

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\corrigir-deploy.ps1
```

O ZIP limpo será gerado fora da pasta do projeto, sem `node_modules`, `.next`, `.git`, `.vercel`, `.env` e `.env.local`.
