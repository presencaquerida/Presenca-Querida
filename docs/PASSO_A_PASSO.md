# Passo a passo — Presença Querida

## 1. Abrir o projeto local

```bash
cd presenca-querida
cp .env.example .env.local
npm install
npm run check
npm run dev
```

No Windows PowerShell:

```powershell
cd presenca-querida
copy .env.example .env.local
npm install
npm run check
npm run dev
```

Acesse:

- `http://localhost:3000`
- `http://localhost:3000/cliente/daniela-50`
- `http://localhost:3000/convite/ana-silva-dani50`
- `http://localhost:3000/gestao`

Sem variáveis do Supabase, o projeto roda em modo demo local.

## 2. Criar tabelas no Supabase

Abra o SQL Editor do Supabase e rode nesta ordem:

1. `supabase/sql/01_schema.sql`
2. `supabase/sql/02_seed_daniela.sql`

O arquivo `03_modelo_insert_convidados_reais.sql` serve como modelo para cadastrar convidados reais com tokens aleatórios.

## 3. Configurar `.env.local`

Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
ADMIN_ACCESS_TOKEN=crie-um-token-forte
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Atenção: `SUPABASE_SERVICE_ROLE_KEY` nunca deve ser exposta no navegador e nunca deve ser commitada no GitHub.

## 4. Testar localmente com Supabase

```bash
npm run dev
```

Teste:

- Abrir a página da cliente.
- Abrir o convite exemplo.
- Confirmar presença.
- Abrir a gestão e informar o `ADMIN_ACCESS_TOKEN`.
- Exportar CSV.

## 5. Subir para GitHub

```bash
git init
git add .
git commit -m "Primeira versão Presença Querida"
git branch -M main
git remote add origin https://github.com/presencaquerida/Presenca-Querida.git
git push -u origin main
```

## 6. Publicar na Vercel via CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add ADMIN_ACCESS_TOKEN production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel --prod
```

Se preferir deploy automático pelo GitHub, importe o repositório na Vercel e cadastre as mesmas variáveis em Project Settings > Environment Variables.

## 7. Gerar ZIP atualizado

Linux/macOS/WSL:

```bash
bash scripts/gerar-zip.sh
```

Windows PowerShell:

```powershell
.\scripts\gerar-zip.ps1
```
