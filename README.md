# Presença Querida — Daniela 50 anos

MVP mobile-first para gestão afetiva de presenças, com login Supabase, painel de cliente, painel de gestão, convite dinâmico por convidado, modelo CSV de importação e mural de depoimentos.

## Rotas principais

- `/` — página comercial da solução Presença Querida.
- `/login` — login com Supabase Auth.
- `/recuperar-senha` — envio de link para troca de senha.
- `/atualizar-senha` — cadastro de nova senha depois do link de recuperação.
- `/cliente/daniela-50` — área da cliente Daniela 50.
- `/gestao` — área de gestão da Presença Querida/Automação Extrema.
- `/convite/ana-silva-dani50` — exemplo de convite individual dinâmico.
- `/convite/marcos-familia-dani50` — exemplo de invite com várias pessoas no mesmo link.
- `/modelos/convidados-modelo.csv` — modelo para download e importação.

## Rodar localmente

```powershell
cd C:\Users\lacos\Documents\GitHub\presenca-querida
powershell -ExecutionPolicy Bypass -File .\scripts\aplicar-atualizacao.ps1
npm run dev
```

## Supabase

1. Rode `supabase/sql/01_schema.sql`.
2. Rode `supabase/sql/02_seed_daniela.sql`.
3. Crie os usuários no Supabase Auth:
   - `daniela50@gmail.com`
   - `presencaquerida@gmail.com`
4. Rode `supabase/sql/03_profiles_usuarios.sql`.
5. Configure `.env.local` com:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_ACCESS_TOKEN=um-token-forte-opcional
```

## Convites dinâmicos

Cada convidado possui um `token` único e recebe um link próprio. A página abre com os dados do invite já preenchidos, por exemplo:

```txt
/convite/ana-silva-dani50
/convite/marcos-familia-dani50
```

O convidado só escolhe se vai, talvez ou não poderá ir, informa total de adultos/crianças do invite e pode deixar observações. Depois, pode enviar depoimento para o mural da aniversariante.

## Gerar ZIP limpo

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\gerar-zip.ps1
```
