# Passo a passo de atualização

## 1. Fazer backup

Antes de substituir arquivos, faça um commit do estado atual:

```powershell
git status
git add .
git commit -m "Backup antes dos ajustes Presenca Querida"
```

## 2. Extrair o ZIP atualizado

Extraia o ZIP na raiz do projeto `C:\Users\lacos\Documents\GitHub\presenca-querida`, substituindo arquivos existentes.

## 3. Remover leftovers antigos

Esta versão usa `app/` na raiz e CSS próprio. Execute:

```powershell
cd C:\Users\lacos\Documents\GitHub\presenca-querida
powershell -ExecutionPolicy Bypass -File .\scripts\aplicar-atualizacao.ps1
```

Esse script remove `src/`, `.next`, `node_modules`, arquivos antigos de Tailwind/PostCSS, reinstala dependências e roda `npm run check`.

## 4. Configurar Supabase

No SQL Editor do Supabase, rode nesta ordem:

1. `supabase/sql/01_schema.sql`
2. `supabase/sql/02_seed_daniela.sql`
3. Criar os usuários em Authentication > Users
4. `supabase/sql/03_profiles_usuarios.sql`

Usuários esperados:

- `daniela50@gmail.com` -> perfil `cliente`, evento `daniela-50`
- `presencaquerida@gmail.com` -> perfil `gestao`, acesso geral

## 5. Variáveis de ambiente

No `.env.local` local e no Vercel, configurar:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://presenca-querida.vercel.app
ADMIN_ACCESS_TOKEN=um-token-forte-opcional
```

## 6. Testar localmente

```powershell
npm run check
npm run dev
```

Testar:

- `/`
- `/login`
- `/cliente/daniela-50`
- `/gestao`
- `/convite/ana-silva-dani50`
- `/convite/marcos-familia-dani50`

## 7. Publicar

```powershell
git add .
git commit -m "Atualiza Presenca Querida com login, convites dinamicos e mural"
git push
```
