# Passo a passo — Presença Querida

## 1\. Abrir o projeto local

```bash
cd presenca-querida
cp .env.example .env.local
npm install
npm run dev
```

No Windows PowerShell:

```powershell
cd presenca-querida
copy .env.example .env.local
npm install
npm run dev
```

Acesse:

* `http://localhost:3000`
* `http://localhost:3000/cliente/daniela-50`
* `http://localhost:3000/convite/ana-silva-dani50`
* `http://localhost:3000/gestao`

Sem variáveis do Supabase, o projeto roda em modo demo local.

## 2\. Criar tabelas no Supabase

Abra o SQL Editor do Supabase e rode nesta ordem:

1. `supabase/sql/01\\\_schema.sql`
2. `supabase/sql/02\\\_seed\\\_daniela.sql`

O arquivo `03\\\_modelo\\\_insert\\\_convidados\\\_reais.sql` serve como modelo para cadastrar convidados reais com tokens aleatórios.

## 3\. Configurar `.env.local`

Edite o arquivo `.env.local`:

```env
NEXT\\\_PUBLIC\\\_SUPABASE\\\_URL=https://SEU-PROJETO.supabase.co
SUPABASE\\\_SERVICE\\\_ROLE\\\_KEY=SUA\\\_SERVICE\\\_ROLE\\\_KEY
ADMIN\\\_ACCESS\\\_TOKEN=crie-um-token-forte
NEXT\\\_PUBLIC\\\_SITE\\\_URL=http://localhost:3000
```

Atenção: `SUPABASE\\\_SERVICE\\\_ROLE\\\_KEY` nunca deve ser exposta no navegador e nunca deve ser commitada no GitHub.

## 4\. Testar localmente com Supabase

```bash
npm run dev
```

Teste:

* Abrir a página da cliente.
* Abrir o convite exemplo.
* Confirmar presença.
* Abrir a gestão e informar o `ADMIN\\\_ACCESS\\\_TOKEN`.
* Exportar CSV.

## 5\. Subir para GitHub

```bash
git init
git add .
git commit -m "Primeira versão Presença Querida"
git branch -M main
git remote add origin https://github.com/SEU\\\_USUARIO/presenca-querida.git
git push -u origin main
```

## 6\. Publicar na Vercel via CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env add NEXT\\\_PUBLIC\\\_SUPABASE\\\_URL production
vercel env add SUPABASE\\\_SERVICE\\\_ROLE\\\_KEY production
vercel env add ADMIN\\\_ACCESS\\\_TOKEN production
vercel env add NEXT\\\_PUBLIC\\\_SITE\\\_URL production
vercel --prod
```

Se preferir deploy automático pelo GitHub, importe o repositório na Vercel e cadastre as mesmas variáveis em Project Settings > Environment Variables.

## 7\. Gerar ZIP atualizado

Linux/macOS/WSL:

```bash
bash scripts/gerar-zip.sh
```

Windows PowerShell:

```powershell
.\\\\scripts\\\\gerar-zip.ps1
```

