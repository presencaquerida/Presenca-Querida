# Mapa das funcionalidades

## Arquivos principais

| Funcionalidade | Caminho |
| --- | --- |
| Logo SVG Presença Querida | `public/logo-presenca-querida.svg` |
| Logo Automação Extrema | `public/ae-logo.png` |
| Cabeçalho | `components/BrandHeader.tsx` |
| Página comercial | `app/page.tsx` |
| Página cliente Daniela | `app/cliente/daniela-50/page.tsx` |
| Redirecionamento /cliente | `app/cliente/page.tsx` |
| Convite individual | `app/convite/[token]/page.tsx` |
| Painel de gestão | `app/gestao/page.tsx` |
| Dados demo | `lib/demo-data.ts` |
| API convidado | `app/api/guests/[token]/route.ts` |
| API gestão | `app/api/admin/[slug]/route.ts` |
| SQL Supabase | `supabase/sql` |

## URLs da demo

- `/` — página comercial do Presença Querida.
- `/cliente/daniela-50` — demo da cliente Daniela Mattano da Silva.
- `/convite/ana-silva-dani50` — convite individual de exemplo.
- `/gestao` — painel de gestão.
- `/privacidade` — página simples de privacidade.

## Por que esta versão está em app/ na raiz

Nos testes anteriores, os logs do build apontavam para `app/layout.tsx` e `app/globals.css`. Isso indica que o projeto local estava usando a pasta `app/` na raiz. Por isso, esta versão final deixa as páginas diretamente em `app/`, evitando que o Next/Vercel ignore funcionalidades que estariam dentro de `src/app`.
