# Presença Querida — Daniela 50 anos

MVP mobile-first para gestão afetiva de presenças, criado com Next.js, TypeScript e Supabase.

## Funcionalidades incluídas

- Logo SVG do **Presença Querida** em `public/logo-presenca-querida.svg`.
- Logo da **Automação Extrema** em `public/ae-logo.png`.
- Cabeçalho com botões **Cliente** e **Gestão**.
- Faixa **Desenvolvido por Automação Extrema** com link para o site.
- Página comercial em `/`.
- Página da cliente demo em `/cliente/daniela-50`.
- Convite individual em `/convite/ana-silva-dani50`.
- Painel de gestão em `/gestao`.
- API para convidado em `/api/guests/[token]`.
- API de gestão em `/api/admin/[slug]`.
- SQLs do Supabase em `supabase/sql`.
- Fotos do cardápio J_M Festas em `public/cardapio/jm-festas`.

## Observação importante sobre estrutura

Esta versão usa a estrutura padrão com `app/`, `components/` e `lib/` na raiz do projeto.

Isso evita o problema de ter arquivos em `src/app` enquanto o repositório local/Vercel está usando `app/` na raiz. Se existir uma pasta `src/` antiga no seu projeto local, ela pode ser removida depois de conferir que esta versão está funcionando.

## Rodar localmente

```powershell
npm install
npm run check
npm run dev
```

Acesse:

```txt
http://localhost:3000/
http://localhost:3000/cliente/daniela-50
http://localhost:3000/convite/ana-silva-dani50
http://localhost:3000/gestao
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local`.

Sem Supabase configurado, o sistema usa dados de demonstração em `lib/demo-data.ts`.

Para usar Supabase, configure:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_ACCESS_TOKEN=
```

O painel `/gestao` pede o token definido em `ADMIN_ACCESS_TOKEN` quando o Supabase/ambiente exigir proteção.

## Gerar ZIP limpo

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\gerar-zip.ps1
```

O ZIP será criado na pasta acima do projeto.
