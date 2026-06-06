# Presença Querida - Atualização v5 Login

## O que mudou

Esta versão corrige o login que ficava preso em **Entrando...**.

A autenticação agora passa primeiro por uma rota server-side:

- `/api/auth/login`

Essa rota autentica no Supabase, busca o perfil do usuário e devolve para o navegador a sessão e o destino correto:

- cliente -> `/cliente/daniela-50`
- gestão -> `/gestao`

A página `/login` grava a sessão no navegador e redireciona. Se algo falhar, aparece uma mensagem clara, sem ficar carregando para sempre.

## Passo a passo

1. Extraia o ZIP na raiz do projeto.
2. Rode:

```powershell
cd C:\Users\lacos\Documents\GitHub\presenca-querida
powershell -ExecutionPolicy Bypass -File .\scripts\aplicar-atualizacao.ps1
npm run check
```

3. No Supabase SQL Editor, rode:

```txt
supabase/sql/03_profiles_usuarios.sql
supabase/sql/04_diagnostico_login.sql
```

4. Confira se o resultado do diagnóstico mostra perfil para o usuário testado.

5. No Vercel, confirme as variáveis:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
```

6. Suba para GitHub:

```powershell
git add .
git commit -m "Corrige login travado do Presenca Querida"
git push
```

## Observação importante

Se você tentar entrar com `marcioalex.silva@gmail.com`, esse usuário precisa existir em **Supabase > Authentication > Users** e também precisa aparecer na tabela `profiles` como `gestao` após rodar o SQL `03_profiles_usuarios.sql`.
