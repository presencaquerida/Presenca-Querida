# Presença Querida

MVP mobile-first para gestão afetiva de presença, com demo da primeira cliente: **Daniela Mattano da Silva — 50 anos**.

## O que já vem implementado

- Cabeçalho no padrão solicitado, com navegação **Cliente** e **Gestão**.
- Logo vetorial do **Presença Querida**.
- Badge de desenvolvimento por **Automação Extrema**.
- Página comercial inicial.
- Página da cliente demo `Daniela 50 anos`.
- Página de convite individual por token.
- Confirmação de presença, talvez ou ausência.
- Campos de acompanhantes, crianças, observação para buffet e recado.
- Painel de gestão com resumo, filtros, mensagens por fase e exportação CSV.
- SQLs para Supabase.
- Fotos do cardápio J_M Festas em `public/cardapio/jm-festas`.
- Estratégia revisada para **Oceano Azul** em `docs/ESTRATEGIA_OCEANO_AZUL.md`.
- Passo a passo completo em `docs/PASSO_A_PASSO.md`.

## Como rodar rápido

```bash
cp .env.example .env.local
npm install
npm run dev
```

Acesse:

- `/cliente/daniela-50`
- `/convite/ana-silva-dani50`
- `/gestao`

Sem Supabase configurado, o projeto usa dados de demonstração.


## Conferir antes do deploy

```bash
npm run lint
npm run typecheck
npm run build
```

Ou rode tudo de uma vez:

```bash
npm run check
```

Correções de deploy estão documentadas em `docs/CORRECAO_DEPLOY.md`.

## Supabase

Rode no SQL Editor:

1. `supabase/sql/01_schema.sql`
2. `supabase/sql/02_seed_daniela.sql`

Depois preencha `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_ACCESS_TOKEN=
NEXT_PUBLIC_SITE_URL=
```

## Segurança

- Nunca publique `.env.local`.
- Nunca use `SUPABASE_SERVICE_ROLE_KEY` em componentes client-side.
- Para convidados reais, use tokens aleatórios, não nomes simples.
- Use `ADMIN_ACCESS_TOKEN` forte em produção.

## Gerar ZIP

```bash
npm run zip
```
