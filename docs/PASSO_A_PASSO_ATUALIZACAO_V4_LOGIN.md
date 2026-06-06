# Presença Querida — Atualização v4 Login

## O que mudou

- Página `/login` simplificada para **Acesso para quem já é cliente**.
- Inclusão do botão **Mostrar/Ocultar senha**.
- Login com tratamento de erro e timeout para não ficar preso em **Entrando...**.
- Redirecionamento por perfil:
  - `role = cliente` → `/cliente/<event_slug>`
  - `role = gestao` → `/gestao`
- Fallback de leitura do perfil pelo próprio cliente Supabase, além da rota server-side `/api/me/profile`.
- Rota `/api/admin/[slug]` criada para área Cliente/Gestão.
- Rota `/api/guests/[token]` criada para convites dinâmicos.
- Página `/convite/[token]` criada para resposta do convidado e envio de recado.
- `03_profiles_usuarios.sql` atualizado com perfil opcional para `marcioalex.silva@gmail.com` como gestão, caso esse usuário exista no Auth.
- `postcss.config.mjs` vazio incluído para isolar o projeto de configurações PostCSS/Tailwind externas no computador.

## Passo a passo

### 1. Backup antes de substituir

```powershell
cd C:\Users\lacos\Documents\GitHub\presenca-querida
git status
git add .
git commit -m "Backup antes da correcao de login v4"
```

Se não houver nada para commitar, siga para o próximo passo.

### 2. Extrair o ZIP

Extraia o conteúdo de `presenca-querida-login-v4-corrigido.zip` dentro de:

```powershell
C:\Users\lacos\Documents\GitHub\presenca-querida
```

Substitua os arquivos existentes.

### 3. Rodar limpeza e validação

```powershell
cd C:\Users\lacos\Documents\GitHub\presenca-querida
powershell -ExecutionPolicy Bypass -File .\scripts\aplicar-atualizacao.ps1
```

Esse script remove `.next`, `node_modules` e sobras antigas, recria o `postcss.config.mjs` limpo, reinstala dependências e roda `npm run check`.

### 4. Conferir perfis no Supabase

Confirme em **Authentication > Users** que existem os usuários que você quer usar.

Depois rode no SQL Editor:

```sql
-- se ainda não rodou a estrutura toda
-- supabase/sql/01_schema.sql
-- supabase/sql/02_seed_daniela.sql

-- rode este para garantir perfis e liberar os acessos
-- supabase/sql/03_profiles_usuarios.sql
```

Perfis esperados:

- `daniela50@gmail.com` → cliente do evento `daniela-50`
- `presencaquerida@gmail.com` → gestão
- `marcioalex.silva@gmail.com` → gestão, se esse usuário existir no Auth

### 5. Testar localmente

```powershell
npm run dev
```

Teste:

```txt
http://localhost:3000/login
http://localhost:3000/cliente/daniela-50
http://localhost:3000/gestao
http://localhost:3000/convite/ana-silva-dani50
```

### 6. Subir para GitHub/Vercel

```powershell
git add .
git commit -m "Corrige login e rotas dinamicas do Presenca Querida"
git push
```

## Observação sobre o login preso em Entrando

Se o e-mail/senha estiver correto, mas o usuário não tiver linha em `public.profiles`, agora o sistema mostra mensagem clara e não fica carregando para sempre. Para liberar acesso, rode o `03_profiles_usuarios.sql` após criar o usuário no Supabase Auth.
