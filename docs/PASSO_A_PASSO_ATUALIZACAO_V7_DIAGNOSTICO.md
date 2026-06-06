# Presença Querida - Atualização v7

## O que esta versão inclui

- Cabeçalho fixo no mobile.
- Botões de WhatsApp com texto `Fale no WhatsApp`.
- Nova página `/diagnostico`.
- API `/api/leads/diagnostico` para gravar leads na Gestão.
- Área de Gestão mostrando leads recebidos.
- Área de Gestão para editar redes sociais e rodapé.
- API `/api/management/settings`.
- API `/api/management/leads`.
- SQL atualizado com tabelas `site_settings` e `lead_diagnostics`.
- Correção para a Gestão não ficar indefinidamente em `Validando acesso da gestão...`.

## Link da Gestão

Produção:

```txt
https://presenca-querida.vercel.app/gestao
```

Local:

```txt
http://localhost:3000/gestao
```

## Atualização local

```powershell
cd C:\Users\lacos\Documents\GitHub\presenca-querida
git status
git add .
git commit -m "Backup antes da atualizacao v7 diagnostico"
```

Extraia o ZIP por cima do projeto, substituindo os arquivos.

Depois rode:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\aplicar-atualizacao.ps1
npm run check
npm run dev
```

## SQL no Supabase

No SQL Editor, rode:

```txt
supabase/sql/05_cadastro_clientes_planos.sql
supabase/sql/03_profiles_usuarios.sql
```

O `05_cadastro_clientes_planos.sql` agora também cria:

- `site_settings`
- `lead_diagnostics`

## Variáveis necessárias no Vercel

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=https://presenca-querida.vercel.app
ADMIN_ACCESS_TOKEN=troque-este-token
```

## Testes

```txt
/
/diagnostico
/login
/gestao
/cliente/daniela-50
```

## Subir para GitHub/Vercel

```powershell
git add .
git commit -m "Inclui diagnostico de leads e configuracoes do rodape"
git push
```
